import {
  inject
} from '@loopback/context';
import {ValueOrPromise} from '@loopback/core';
import { repository } from '@loopback/repository';
import { ProjectRepository } from '../repositories';
import { GithubService } from '../services/github-service';
import { NginxService } from '../services/nginx-service';
import {DockerServiceBindings, GithubServiceBindings, NginxServiceBindings, SubdomainServiceBindings} from '../keys';
import {DockerService} from '../services/docker-service';
import {SubdomainService} from '../services/subdomain-service';

export interface LifeCycleObserver {
  init?(...injectedArgs: unknown[]): ValueOrPromise<void>;
  stop?(...injectedArgs: unknown[]): ValueOrPromise<void>;
}

export default class ServiceLifecycle implements LifeCycleObserver {
  async init(
    @repository(ProjectRepository) projectRepository: ProjectRepository,
    @inject(SubdomainServiceBindings.SUBDOMAIN_SERVICE) subdomainService: SubdomainService,
    @inject(GithubServiceBindings.GITHUB_SERVICE) githubService: GithubService,
  ) {
    const projects = await projectRepository.find();
    await Promise.all(projects.map((project) => {
      return githubService.syncProjectBranch(project);
    }));
    await subdomainService.writeConfig();
  }

  async stop(
    @inject(DockerServiceBindings.DOCKER_SERVICE) dockerService: DockerService,
    @inject(NginxServiceBindings.NGINX_SERVICE) nginxService: NginxService,
  ) {
    nginxService.disconnect();
    dockerService.disconnect();
  }
}
