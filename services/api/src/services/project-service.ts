import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {DockerServiceBindings, GithubServiceBindings, NginxServiceBindings, ProxiesServiceBindings} from '../keys';
import {Cluster, Container} from '../models';
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

  /** Deploy nginx config if file not exists */
  deployNginxConf = async (filename: string) => {
    const isDeployed = await this.nginxService.siteEnabledExists(filename);
    if (!isDeployed) {
      await this.nginxService.deploySiteAvailable(filename);
    }
    await this.nginxService.reloadService();
  }

  deployDev = async (cluster: Cluster, opts: DeployPayload): Promise<Container> => {
    const {branchName, lastCommit} = opts;
    const container = await this.dockerService.clusterDeploy({
      branch: branchName,
      commitSHA: lastCommit,
      isProduction: false,
      isGeneratedDeploy: true,
      namespace: cluster.namespace,
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
    const clusterProd = await this.clusterProductionRepository.findOne({
      where: {
        projectName: cluster.projectName,
      }
    });
    const mainDomain = clusterProd?.domain || 'nxtra.net';
    await this.nginxService.writeDevConfig(container.namespace, {
      domain: `${container.name}.${mainDomain}`,
      port: container.appPort,
      host: '127.0.0.1',
    });
    await this.deployNginxConf(container.namespace);
    await Promise.all(containersToDelete.map((container) => {
      return this.dockerService.clusterContainerRemove(container);
    }));
  }

  deployProd = async (cluster: Cluster, opts: DeployPayload): Promise<Container[]> => {
    const {lastCommit} = opts;
    const {
      namespace,
      production,
    } = cluster;
    const containersToDelete = await this.containerRepository.find({
      where: {
        clusterNamespace: cluster.namespace,
      }
    });
    const minInstances = Array(production.numberOfInstances).fill(1);
    const containers = await Promise.all<Container>(minInstances.map(() =>
      this.dockerService.clusterDeploy({
        namespace,
        commitSHA: lastCommit,
        isProduction: true,
        isGeneratedDeploy: true,
        // Tricks for ts branch is sure to be set there.
        branch: cluster?.gitBranch?.name || '',
      })
    ));
    await Promise.all(containersToDelete.map(async (container) => {
      return this.dockerService.clusterContainerRemove(container);
    }));
    return containers;
  }

  deployBGProd = async (cluster: Cluster, containers: Container[]) => {
    const {production, projectName, name} = cluster;
    const ports = await Promise.all((containers.map(async (container) => {
      await this.dockerService.whenContainerReady(container);
      return container.appPort;
    })));
    const nginxConfig = {
      ports,
      domain: production.domain,
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
    if (cluster.production) { // deploy for production means real ip binding to serve the project.
      const containers = await this.deployProd(cluster, opts);
      this.deployBGProd(cluster, containers).catch((err) => {
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
}
