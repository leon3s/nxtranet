import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {ModelClusterType} from '../../../../packages/headers/dist';
import {DnsmasqServiceBindings, DockerServiceBindings, GithubServiceBindings, NginxServiceBindings, SystemServiceBindings} from '../keys';
import {Cluster, Container, Pipeline, Project} from '../models';
import {ClusterPipelineRepository, ClusterRepository, ContainerRepository, NginxAccessLogRepository, PipelineRepository, ProjectRepository} from '../repositories';
import {DnsmasqService} from './dnsmasq-service';
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
    @repository(ClusterPipelineRepository)
    protected clusterPipelineRepository: ClusterPipelineRepository,
    @repository(PipelineRepository)
    protected pipelineRepository: PipelineRepository,
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
    @inject(DnsmasqServiceBindings.DNSMASQ_SERVICE)
    protected dnsmasqService: DnsmasqService,
  ) { }

  /** Called when application boot */
  boot = async () => {
    this.nginxService.monitorAccessLog(async (err, log) => {
      if (err) {
        console.error('Nginx monitoring error : ', err);
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
  }

  deleteContainer = async (container: Container) => {
    await this.dockerService.deleteContainer(container);
    await this.nginxService.clearSite(container.namespace);
  }

  dockerHookClusterDeploy = async (cluster: Cluster, opts: DeployPayload) => {
    const {branchName, lastCommit, isGeneratedDeploy, isProduction} = opts;
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
    await this.dnsmasqService.configSync();
    await this.dnsmasqService.restartService();
    await this.nginxService.reloadService();
    await Promise.all(containersToDelete.map((container) => {
      return this.deleteContainer(container);
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
    const nginxFilename = this.nginxService.formatName(projectName, name);
    const nginxFileExists = await this.nginxService.siteAvailableExists(nginxFilename);
    if (nginxFileExists) {
      await this.nginxService.updateProdConfig(nginxConfig);
    } else {
      await this.nginxService.createProdConfig(nginxConfig);
    }
    await this.deployNginxConf(nginxFilename);
    await this.dnsmasqService.configSync();
    await this.dnsmasqService.restartService();
    await this.nginxService.reloadService();
  }

  deleteContainers = (containers: Container[]) => {
    return Promise.all(containers.map(async (container) => {
      return this.deleteContainer(container);
    }));
  }

  deployCluster = async (cluster: Cluster, opts: DeployPayload): Promise<Container[]> => {
    const containersToDelete = await this.containerRepository.find({
      where: {
        clusterNamespace: cluster.namespace,
      }
    });
    if (cluster.type === ModelClusterType.SCALING) {
      // If cluster is in scalling mode we deploy like if it for production
      const containers = await this.deployProd(cluster, opts);
      this.deployBGProd(cluster, containers)
        .then(() => this.deleteContainers(containersToDelete))
        .catch((err) => console.error('deployDB Prod error ', err));
      return containers;
    } else {
      // Else we deploy like any others cases //
      const container = await this.deployDev(cluster, opts);
      this.deployBGDev(cluster, container, opts)
        .then(() => {
          if (cluster.type !== ModelClusterType.TESTING) {
            return this.deleteContainers(containersToDelete);
          }
        })
        .catch((err) => console.error('deployBG Dev error ', err));
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

  deleteProject = async (project: Project) => {
    const pipelines = await this.projectRepository.pipelines(project.name).find();
    await Promise.all(pipelines.map((pipeline) => {
      return this.deletePipeline(pipeline);
    }));
    const clusters = await this.projectRepository.clusters(project.name).find();
    await Promise.all(clusters.map((cluster) => {
      return this.deleteCluster(cluster);
    }));
    await this.projectRepository.gitBranches(project.name).delete();
    await this.projectRepository.delete(project);
  }

  deletePipeline = async (pipeline: Pipeline) => {
    await this.pipelineRepository.commands(pipeline.namespace).delete();
    await this.pipelineRepository.delete(pipeline);
  }

  deleteCluster = async (cluster: Cluster) => {
    await this.clusterRepository.envVars(cluster.namespace).delete();
    await this.clusterPipelineRepository.deleteAll({
      clusterId: cluster.id,
    });
    const containers = await this.clusterRepository.containers(cluster.namespace).find();
    await Promise.all((containers.map((container) => {
      return this.deleteContainer(container);
    })));
    const name = this.nginxService.formatName(cluster.projectName, cluster.name);
    await this.nginxService.clearSite(name);
    await this.clusterRepository.delete(cluster);
  }

  patchProject = async () => {

  }

  patchProjectCluster = async () => {

  }
}
