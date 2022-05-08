import {
  inject
} from '@loopback/context';
import {ValueOrPromise} from '@loopback/core';
import {
  DnsmasqServiceBindings,
  DockerServiceBindings,
  NginxServiceBindings,
  ProjectServiceBindings,
  SystemServiceBindings
} from '../keys';
import {DnsmasqService} from '../services/dnsmasq-service';
import {DockerService} from '../services/docker-service';
import {NginxService} from '../services/nginx-service';
import ProjectService from '../services/project-service';
import {SystemService} from '../services/system-service';

export interface LifeCycleObserver {
  init?(...injectedArgs: unknown[]): ValueOrPromise<void>;
  stop?(...injectedArgs: unknown[]): ValueOrPromise<void>;
}

export default class ServiceLifecycle implements LifeCycleObserver {
  async init(
    @inject(NginxServiceBindings.NGINX_SERVICE) nginxService: NginxService,
    @inject(SystemServiceBindings.SYSTEM_SERVICE) systemService: SystemService,
    @inject(DockerServiceBindings.DOCKER_SERVICE) dockerService: DockerService,
    @inject(DnsmasqServiceBindings.DNSMASQ_SERVICE) dnsmasqServcice: DnsmasqService,
  ) {
    nginxService.connect();
    await nginxService.waitConnection();
    systemService.connect();
    await systemService.waitConnection();
    dockerService.connect();
    await dockerService.waitConnection();
    dnsmasqServcice.connect();
    await dnsmasqServcice.waitConnection();
  }

  async start(
    @inject(ProjectServiceBindings.PROJECT_SERVICE) projectService: ProjectService,
  ) {
    projectService.boot().catch((err) => {
      console.error('project service boot error ', err);
    });
  }

  async stop(
    @inject(NginxServiceBindings.NGINX_SERVICE) nginxService: NginxService,
    @inject(SystemServiceBindings.SYSTEM_SERVICE) systemService: SystemService,
    @inject(DockerServiceBindings.DOCKER_SERVICE) dockerService: DockerService,
    @inject(DnsmasqServiceBindings.DNSMASQ_SERVICE) dnsmasqServcice: DnsmasqService,
  ) {
    nginxService.disconnect();
    systemService.disconnect();
    dockerService.disconnect();
    dnsmasqServcice.disconnect();
  }
}
