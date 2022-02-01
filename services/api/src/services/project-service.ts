import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {DockerServiceBindings, GithubServiceBindings, NginxServiceBindings, ProxiesServiceBindings} from '../keys';
import {Cluster, ClusterProduction, Container} from '../models';
import {ClusterProductionRepository, ClusterRepository, ContainerRepository, NginxAccessLogRepository, ProjectRepository} from '../repositories';
import {DockerService} from './docker-service';
import {GithubService} from './github-service';
import {NginxService} from './nginx-service';
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
    @repository(ProjectRepository)
    protected projectRepository: ProjectRepository,
    @repository(NginxAccessLogRepository)
    protected nginxAccessLogRepository: NginxAccessLogRepository,
    @inject(ProxiesServiceBindings.PROXIES_SERVICE)
    protected proxiesService: ProxiesService,
    @inject(DockerServiceBindings.DOCKER_SERVICE)
    protected dockerService: DockerService,
    @inject(NginxServiceBindings.NGINX_SERVICE)
    protected nginxService: NginxService,
    @inject(GithubServiceBindings.GITHUB_SERVICE)
    protected githubService: GithubService,
  ) { }

  boot = async () => {
    this.nginxService.monitorAccessLog(async (err, log) => {
      if (err) {
        console.error(err);
        return;
      }
      await this.nginxAccessLogRepository.create(log);
    });
    await this.dockerService.syncContainers();
    await this.proxiesService.updateDomains();
    const projects = await this.projectRepository.find();
    await Promise.all(projects.map((project) =>
      this.githubService.syncProjectBranch(project)));
    const containers = await this.containerRepository.find({
      include: [
        {
          relation: 'state',
        },
      ]
    });
    await Promise.all(containers.map(async (container) => {
      if (container.state.Running) {
        await this.dockerService.attachContainer(container);
      } else {
        await this.dockerService.startContainer(container);
      }
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
      console.log('DEPLOY FOR ANY OTHER CASES');
      const container = await this.dockerService.clusterDeploy({
        branch: branchName,
        isProduction: false,
        isGeneratedDeploy: true,
        namespace: cluster.namespace,
      });
      console.log('deployed');
      await this.containerRepository.updateById(container.id, {
        commitSHA: lastCommit,
      });
      console.log('updated');
      await this.dockerService.whenContainerReady(container);
      await this.proxiesService.updateDomains();
      console.log('ready');
      const containersToDelete = await this.containerRepository.find({
        where: {
          commitSHA: {
            nin: [lastCommit],
          },
          gitBranchName: branchName,
        },
      });
      // IF cluster is linked to a branch we write a nginx config //
      if (cluster?.gitBranch?.name) {
        const project = await this.projectRepository.findOne({
          where: {
            name: cluster.projectName,
          },
          include: ['clusterProduction'],
        });
        if (!project) throw new HttpErrors.NotAcceptable('Cluster project is deleted ?');
        const mainDomain = project?.clusterProduction?.domain || 'nextra.net';
        const nginxFilename = this.nginxService.formatFilename(cluster.projectName, cluster.name);
        await this.nginxService.writeDevConfig(nginxFilename, {
          domain: mainDomain === 'nextra.net' ?
            `${nginxFilename}.${mainDomain}` :
            `${cluster.name}.${mainDomain}`,
          port: container.appPort,
        });
        await this.deployNginxConf(nginxFilename);
      }
      await Promise.all(containersToDelete.map((container) => {
        return this.dockerService.clusterContainerRemove(container);
      }));
    }
  }

  deployNginxConf = async (filename: string) => {
    const isDeployed = await this.nginxService.siteEnabledExists(filename);
    if (!isDeployed) {
      await this.nginxService.deploySiteAvailable(filename);
    }
    await this.nginxService.reloadService();
  }

  deployProduction = async (cluster: Cluster, clusterProduction: ClusterProduction): Promise<Container[] | null> => {
    const {
      name,
      namespace,
      projectName,
    } = cluster;
    const minInstances = Array(clusterProduction.numberOfInstances).fill(1);
    if (!cluster?.gitBranch?.name) return null;
    const containers = await Promise.all<Container>(minInstances.map(async () => {
      const container = await this.dockerService.clusterDeploy({
        namespace,
        isProduction: true,
        isGeneratedDeploy: true,
        branch: cluster?.gitBranch?.name || '',
      });
      await this.dockerService.whenContainerReady(container);
      return container;
    }));
    const nginxConfig = {
      domain: clusterProduction.domain,
      ports: containers.map((container) => container.appPort),
      projectName: cluster.projectName,
      clusterName: cluster.name,
    };
    const nginxFilename = this.nginxService.formatFilename(projectName, name);
    const nginxFileExists = await this.nginxService.siteAvailableExists(nginxFilename);
    if (nginxFileExists) {
      await this.nginxService.updateProdConfig(nginxConfig);
    } else {
      await this.nginxService.createProdConfig(nginxConfig);
    }
    await this.deployNginxConf(nginxFilename);
    return containers;
  }
}
