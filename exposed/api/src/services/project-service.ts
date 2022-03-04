import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {ModelClusterType} from '../../../../packages/headers/dist';
import {DockerServiceBindings, GithubServiceBindings, NginxServiceBindings, SystemServiceBindings} from '../keys';
import {Cluster, Container, Project} from '../models';
import {ClusterRepository, ContainerRepository, NginxAccessLogRepository, ProjectRepository} from '../repositories';
import {DockerService} from './docker-service';
import {GithubService} from './github-service';
import {NginxService} from './nginx-service';
import {SystemService} from './system-service';

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
    @repository(ClusterRepository)
    protected clusterRepository: ClusterRepository,
    @repository(ProjectRepository)
    protected projectRepository: ProjectRepository,
    @repository(NginxAccessLogRepository)
    protected nginxAccessLogRepository: NginxAccessLogRepository,
    @inject(SystemServiceBindings.SYSTEM_SERVICE)
    protected systemService: SystemService,
    @inject(DockerServiceBindings.DOCKER_SERVICE)
    protected dockerService: DockerService,
    @inject(NginxServiceBindings.NGINX_SERVICE)
    protected nginxService: NginxService,
    @inject(GithubServiceBindings.GITHUB_SERVICE)
    protected githubService: GithubService,
  ) { }

  /** Called when application boot */
  boot = async () => {
    this.nginxService.monitorAccessLog(async (err, log) => {
      if (err) {
        console.error(err);
        return;
      }
      await this.nginxAccessLogRepository.create(log);
    });
    await this.dockerService.syncContainers();
    const projects = await this.projectRepository.find();
    await Promise.all(projects.map(this.githubService.syncProjectBranch));
    const containers = await this.containerRepository.find({
      include: [
        {
          relation: 'state',
        },
      ]
    });
    await Promise.all(containers.map(async (container) => {
      console.log(container)
      if (container?.state?.Running) {
        await this.dockerService.attachContainer(container);
      } else {
        await this.dockerService.startContainer(container);
      }
    }));
  }

  /** Deploy nginx config if file not exists */
  deployNginxConf = async (filename: string) => {
    const isDeployed = await this.nginxService.siteEnabledExists(filename);
    if (!isDeployed) {
      await this.nginxService.deploySiteAvailable(filename);
    }
    await this.nginxService.reloadService();
  }

  removeContainer = async (container: Container) => {
    await this.nginxService.clearSite(container.namespace);
    await this.dockerService.clusterContainerRemove(container);
  }

  dockerHookClusterDeploy = async (cluster: Cluster, opts: DeployPayload) => {
    const {branchName, lastCommit, isGeneratedDeploy, isProduction} = opts;
    console.log('im called !');
    const container = await this.dockerService.clusterDeploy({
      commitSHA: lastCommit,
      isProduction: isProduction || false,
      isGeneratedDeploy: isGeneratedDeploy || false,
      branch: branchName,
      namespace: cluster.namespace,
    });
    await this.nginxService.writeDevConfig(container.namespace, {
      domain: `${container.name}.${cluster.hostname}`,
      port: container.appPort,
      host: process.env.NXTRANET_HOST || '127.0.0.1',
    });
    await this.deployNginxConf(container.namespace);
    return container;
  }

  deployDev = async (cluster: Cluster, opts: DeployPayload): Promise<Container> => {
    const {branchName, lastCommit} = opts;
    const container = await this.dockerHookClusterDeploy(cluster, {
      lastCommit,
      isProduction: false,
      isGeneratedDeploy: true,
      branchName,
    });
    return container;
  }

  // Background operation that setup container if he is correctly running
  deployBGDev = async (cluster: Cluster, container: Container, opts: DeployPayload) => {
    const {lastCommit, branchName} = opts;
    await this.dockerService.whenContainerReady(container);
    const containersToDelete = await this.containerRepository.find({
      where: {
        commitSHA: {
          nin: [lastCommit],
        },
        gitBranchName: branchName,
      },
    });
    if (cluster.type !== ModelClusterType.TESTING) {
      await this.nginxService.writeDevConfig(cluster.namespace, {
        domain: cluster.hostname,
        port: container.appPort,
        host: cluster.host,
      });
      await this.deployNginxConf(cluster.namespace);
    }
    await Promise.all(containersToDelete.map((container) => {
      return this.removeContainer(container);
    }));
  }

  deployProd = async (cluster: Cluster, opts: DeployPayload): Promise<Container[]> => {
    const {lastCommit} = opts;
    const minInstances = Array(2).fill(1);
    const containers = await Promise.all<Container>(minInstances.map(() =>
      this.dockerHookClusterDeploy(cluster, {
        lastCommit,
        isProduction: true,
        isGeneratedDeploy: true,
        branchName: cluster?.gitBranch?.name || '',
      })
    ));
    return containers;
  }

  deployBGProd = async (cluster: Cluster, containers: Container[]) => {
    const {projectName, name} = cluster;
    const ports = await Promise.all((containers.map(async (container) => {
      await this.dockerService.whenContainerReady(container);
      return container.appPort;
    })));
    const nginxConfig = {
      ports,
      host: cluster.host,
      domain: cluster.hostname,
      clusterName: cluster.name,
      projectName: cluster.projectName,
    };
    const nginxFilename = this.nginxService.formatFilename(projectName, name);
    const nginxFileExists = await this.nginxService.siteAvailableExists(nginxFilename);
    if (nginxFileExists) {
      await this.nginxService.updateProdConfig(nginxConfig);
    } else {
      await this.nginxService.createProdConfig(nginxConfig);
    }
    await this.deployNginxConf(nginxFilename);
  }

  deployCluster = async (cluster: Cluster, opts: DeployPayload): Promise<Container[]> => {
    if (cluster.type === ModelClusterType.SCALING) { // deploy for production means real ip binding to serve the project.
      const containersToDelete = await this.containerRepository.find({
        where: {
          clusterNamespace: cluster.namespace,
        }
      });
      const containers = await this.deployProd(cluster, opts);
      this.deployBGProd(cluster, containers)
        .then(() => {
          return Promise.all(containersToDelete.map(async (container) => {
            return this.removeContainer(container);
          }));
        })
        .catch((err) => {
          console.error('deployDB Prod error ', err);
        });
      return containers;
    } else { // Deploy for any others cases //
      const container = await this.deployDev(cluster, opts);
      this.deployBGDev(cluster, container, opts)
        .catch((err) => {
          console.error('deployBG Dev error ', err);
        });
      return [container];
    }
  }

  /** Deploy for every clusters that matched branch binding used for github webhook */
  deployClusters = async (clusters: Cluster[], opts: DeployPayload) => {
    const {branchName, lastCommit} = opts;
    await Promise.all(clusters.map((cluster) => {
      return this.deployCluster(cluster, {
        branchName,
        lastCommit,
      });
    }));
  }

  removeProject = async (project: Project) => {
  }
}
