import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {DockerServiceBindings, ProxiesServiceBindings} from '../keys';
import {Cluster, ClusterProduction} from '../models';
import {ClusterProductionRepository, ClusterRepository, ContainerRepository} from '../repositories';
import {DockerService} from './docker-service';
import {ProxiesService} from './proxies-service';

type DeployPayload = {
  branchName: string,
  lastCommit: string,
  isProduction?: boolean,
  isGeneratedDeploy?: boolean,
}

export default
  class ProjectService {
  constructor(
    @repository(ContainerRepository)
    protected containerRepository: ContainerRepository,
    @repository(ClusterProductionRepository)
    protected clusterProductionRepository: ClusterProductionRepository,
    @repository(ClusterRepository)
    protected clusterRepository: ClusterRepository,
    @inject(ProxiesServiceBindings.PROXIES_SERVICE)
    protected proxiesService: ProxiesService,
    @inject(DockerServiceBindings.DOCKER_SERVICE)
    protected dockerService: DockerService,
  ) { }

  boot = async () => {
    await this.dockerService.syncContainers();
    await this.proxiesService.updateDomains();
    const clusterProductions = await this.clusterProductionRepository.find({
      include: ['ports'],
    });
    await Promise.all(clusterProductions.map(async (clusterProd) => {
      const clusterDB = await this.clusterRepository.findOne({
        where: {
          namespace: clusterProd.clusterNamespace,
        },
        include: [{
          relation: 'containers',
          scope: {
            include: ['state'],
          }
        }, 'gitBranch'],
      });
      if (!clusterDB) throw new Error('clusterProd is linked to non existing cluster with namespace ' + clusterProd.clusterNamespace);
      const ports = await Promise.all(clusterProd.ports.map(async (port, i) => {
        if (!clusterDB.gitBranch) throw new Error('Cluster is configured for production without a branch wtf ?');
        let container = clusterDB.containers && clusterDB.containers[i];
        if (!container) {
          container = await this.dockerService.clusterDeploy({
            namespace: clusterDB.namespace,
            branch: clusterDB.gitBranch.name,
            isProduction: true,
            isGeneratedDeploy: true,
          });
        } else if (container.state && container.state.Running) {
          await this.dockerService.attachContainer(container);
        } else {
          await this.dockerService.startContainer(container);
        }
        return {
          listen: port.number,
          app: container.appPort,
        }
      }));
      await this.proxiesService.updateDomains();
      await this.dockerService.syncContainers();
    }));
  }

  deployClusters = async (clusters: Cluster[], opts: DeployPayload) => {
    const {branchName, lastCommit} = opts;
    await Promise.all(clusters.map((cluster) => {
      return this.deployCluster(cluster, {
        branchName,
        lastCommit,
      });
    }));
    await this.proxiesService.updateDomains();
  }

  deployCluster = async (cluster: Cluster, opts: DeployPayload) => {
    const {branchName, lastCommit} = opts;
    if (cluster.production) { // Deploy for production
      const containersToDelete = await this.containerRepository.find({
        where: {
          clusterNamespace: cluster.namespace,
        }
      });
      await this.deployProduction(cluster, cluster.production);
      await Promise.all(containersToDelete.map(async (container) => {
        await this.containerRepository.updateById(container.id, {
          commitSHA: lastCommit,
        });
        return this.dockerService.clusterContainerRemove(container);
      }));
    } else { // Deploy for any others cases //
      const container = await this.dockerService.clusterDeploy({
        branch: branchName,
        isProduction: false,
        isGeneratedDeploy: true,
        namespace: cluster.namespace,
      });
      await this.containerRepository.updateById(container.id, {
        commitSHA: lastCommit,
      });
      this.dockerService.whenContainerReady(container).then(async () => {
        const containers = await this.containerRepository.find({
          where: {
            commitSHA: {
              nin: [lastCommit],
            },
            gitBranchName: branchName,
          },
        });
        await Promise.all(containers.map((container) => {
          return this.dockerService.clusterContainerRemove(container);
        }));
      }).catch((err) => {
        console.error('Webhook github update cluster error ', {err});
      });
    }
  }

  deployProduction = async (cluster: Cluster, clusterProduction: ClusterProduction) => {
    const ports: {
      app: number,
      listen: number,
    }[] = [];
    await Promise.all(clusterProduction.ports.map(async (port) => {
      if (!cluster.gitBranch?.name) return;
      const container = await this.dockerService.clusterDeploy({
        namespace: cluster.namespace,
        branch: cluster.gitBranch.name,
        isProduction: true,
        isGeneratedDeploy: true,
      });
      await this.dockerService.whenContainerReady(container);
      ports.push({
        app: container.appPort,
        listen: port.number,
      });
    }));
    await this.proxiesService.updateDomains();
    this.proxiesService.productionDomains(ports);
  }
}
