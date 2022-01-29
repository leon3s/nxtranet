import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import fs from 'fs';
import mustache from 'mustache';
import path from 'path';
import {DockerServiceBindings, GithubServiceBindings, NginxServiceBindings, ProxiesServiceBindings} from '../keys';
import {Cluster, ClusterProduction, Container} from '../models';
import {ClusterProductionRepository, ClusterRepository, ContainerRepository, ProjectRepository} from '../repositories';
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

type NginxConfigProd = {
  domain: string;
  ports: number[];
  cache_name: string;
  upstream: string;
}

type NginxConfigDev = {
  domain: string;
  port: number;
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
      const containers = await this.containerRepository.find({
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
        const nginxFilename = `${cluster.name}_${cluster.projectName}`;
        await this.writeNginxConfigDev(nginxFilename, {
          domain: mainDomain === 'nextra.net' ?
            `${nginxFilename}.${mainDomain}` :
            `${cluster.name}.${mainDomain}`,
          port: container.appPort,
        });
        await this.nginxService.deploySiteAvaible(nginxFilename);
        await this.nginxService.reloadService();
      }
      await Promise.all(containers.map((container) => {
        return this.dockerService.clusterContainerRemove(container);
      }));
    }
  }

  writeNginxConfigProd = async (filename: string, config: NginxConfigProd) => {
    const d = fs.readFileSync(path.join(__dirname, '../../../../config/nginx/template.production.com')).toString();
    const render = mustache.render(d, {
      ports: config.ports,
      domain_name: config.domain,
      upstream: config.upstream,
      cache_name: config.cache_name,
    });
    await this.nginxService.writeSiteAvaible(filename, render);
  }

  writeNginxConfigDev = async (filename: string, config: NginxConfigDev) => {
    const d = fs.readFileSync(path.join(__dirname, '../../../../config/nginx/template.single.com')).toString();
    const render = mustache.render(d, {
      port: config.port,
      domain_name: config.domain,
    });
    await this.nginxService.writeSiteAvaible(filename, render);
  }

  deployProduction = async (cluster: Cluster, clusterProduction: ClusterProduction): Promise<Container[] | null> => {
    const minInstances = Array(clusterProduction.numberOfInstances).fill(1);
    if (!cluster?.gitBranch?.name) return null;
    const containers = await Promise.all<Container>(minInstances.map(async () => {
      const container = await this.dockerService.clusterDeploy({
        namespace: cluster.namespace,
        branch: cluster?.gitBranch?.name || '',
        isProduction: true,
        isGeneratedDeploy: true,
      });
      await this.dockerService.whenContainerReady(container);
      return container;
    }));
    const nginxConfig = {
      domain: clusterProduction.domain,
      ports: containers.map((container) => container.appPort),
      cache_name: `cache_${cluster.projectName}`,
      upstream: `upstream_${cluster.projectName}`,
    };
    await this.writeNginxConfigProd(`${cluster.projectName}_${cluster.name}`, nginxConfig);
    await this.proxiesService.updateDomains();
    return containers;
  }
}
