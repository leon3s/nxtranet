import {
  inject
} from '@loopback/context';
import {ValueOrPromise} from '@loopback/core';
import {repository} from '@loopback/repository';
import {DockerServiceBindings, GithubServiceBindings, NginxServiceBindings, ProjectServiceBindings, ProxiesServiceBindings} from '../keys';
import {ProjectRepository} from '../repositories';
import {DockerService} from '../services/docker-service';
import {GithubService} from '../services/github-service';
import {NginxService} from '../services/nginx-service';
import ProjectService from '../services/project-service';
import {ProxiesService} from '../services/proxies-service';

export interface LifeCycleObserver {
  init?(...injectedArgs: unknown[]): ValueOrPromise<void>;
  stop?(...injectedArgs: unknown[]): ValueOrPromise<void>;
}

export default class ServiceLifecycle implements LifeCycleObserver {
  async start(
    @repository(ProjectRepository) projectRepository: ProjectRepository,
    @inject(ProxiesServiceBindings.PROXIES_SERVICE) subdomainService: ProxiesService,
    @inject(GithubServiceBindings.GITHUB_SERVICE) githubService: GithubService,
    @inject(ProjectServiceBindings.PROJECT_SERVICE) projectService: ProjectService,
  ) {
    projectService.boot().catch((err) => {
      console.error('project service boot error ', err);
    });
    // const projects = await projectRepository.find();
    // await Promise.all(projects.map((project) => {
    //   return githubService.syncProjectBranch(project);
    // }));
  }

  async stop(
    @inject(NginxServiceBindings.NGINX_SERVICE) nginxService: NginxService,
    @inject(DockerServiceBindings.DOCKER_SERVICE) dockerService: DockerService,
    @inject(ProxiesServiceBindings.PROXIES_SERVICE) subdomainService: ProxiesService,
  ) {
    nginxService.disconnect();
    dockerService.disconnect();
    subdomainService.disconnect();
  }
}
