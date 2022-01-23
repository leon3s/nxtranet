import {inject} from '@loopback/core';
import {
  Filter,
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, HttpErrors,
  param, patch, post,
  requestBody
} from '@loopback/rest';
import {
  DnsmasqServiceBindings,
  DockerServiceBindings,
  NginxServiceBindings,
  ProjectServiceBindings,
  ProxiesServiceBindings
} from '../keys';
import {
  ClusterProduction, Project
} from '../models';
import {
  ClusterProductionRepository,
  ClusterRepository, ContainerRepository, ProjectRepository
} from '../repositories';
import {DnsmasqService} from '../services/dnsmasq-service';
import {DockerService} from '../services/docker-service';
import {NginxService} from '../services/nginx-service';
import ProjectService from '../services/project-service';
import {ProxiesService} from '../services/proxies-service';

export class ProjectClusterProductionController {
  constructor(
    @repository(ClusterProductionRepository)
    protected clusterProductionRepository: ClusterProductionRepository,
    @inject(ProxiesServiceBindings.PROXIES_SERVICE)
    protected proxiesService: ProxiesService,
    @inject(NginxServiceBindings.NGINX_SERVICE)
    protected nginxService: NginxService,
    @inject(DnsmasqServiceBindings.DNSMASQ_SERVICE)
    protected dnsmasqService: DnsmasqService,
    @repository(ClusterRepository)
    protected clusterRepository: ClusterRepository,
    @repository(ContainerRepository)
    protected containerRepository: ContainerRepository,
    @inject(DockerServiceBindings.DOCKER_SERVICE)
    protected dockerService: DockerService,
    @inject(ProjectServiceBindings.PROJECT_SERVICE)
    protected projectService: ProjectService,
    @repository(ProjectRepository)
    protected projectRepository: ProjectRepository,
  ) { }

  @get('/projects/{name}/cluster-production', {
    responses: {
      '200': {
        description: 'Project has one ClusterProduction',
        content: {
          'application/json': {
            schema: getModelSchemaRef(ClusterProduction),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('name') name: string,
    @param.query.object('filter') filter?: Filter<ClusterProduction>,
  ): Promise<ClusterProduction> {
    return this.projectRepository.clusterProduction(name).get(filter);
  }

  @post('/projects/{name}/cluster-production', {
    responses: {
      '200': {
        description: 'Cluster production model instance',
        content: {'application/json': {schema: getModelSchemaRef(ClusterProduction)}},
      },
    },
  })
  async create(
    @param.path.string('name') name: typeof Project.prototype.name,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ClusterProduction, {
            title: 'NewClusterProductionInProject',
            exclude: ['id', 'projectName'],
          }),
        },
      },
    }) clusterProduction: Omit<ClusterProduction, 'id'>,
  ): Promise<ClusterProduction> {
    const {clusterNamespace} = clusterProduction;
    const clusterDB = await this.clusterRepository.findOne({
      where: {
        namespace: clusterNamespace,
      },
      include: ['gitBranch'],
    });
    if (!clusterDB || !clusterDB.gitBranch) {
      throw new HttpErrors
        .NotAcceptable('Cluster for given namespace isn\'t found');
    }
    let clusterProdDB = await this.clusterProductionRepository.findOne({
      where: {
        clusterNamespace,
      }
    });
    if (clusterProdDB) {
      throw new HttpErrors.NotAcceptable('Targeted Cluster has already production settup.');
    }
    clusterProduction.projectName = name;
    clusterProdDB = await this.clusterRepository
      .production(clusterDB.namespace)
      .create(clusterProduction);
    const background = async () => {
      if (!clusterProdDB) return;
      await this.projectService.deployProduction(clusterDB, clusterProdDB);
      await this.dnsmasqService.configSync();
      await this.dnsmasqService.restartService();
      await this.nginxService.deploySiteAvaible(`${clusterDB.projectName}_${clusterDB.name}`);
      await this.nginxService.reloadService();
    }
    background().then(() => {
      console.log('success');
    }).catch((err) => {
      console.error('background deploy fail: ', err);
    });
    return clusterProdDB;
  }

  @patch('/projects/{name}/cluster-production', {
    responses: {
      '200': {
        description: '"Ok" if success',
        content: {'application/json': {schema: getModelSchemaRef(ClusterProduction)}},
      }
    }
  })
  async patch(
    @param.path.string('name') name: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ClusterProduction, {partial: true}),
        },
      },
    })
    clusterProduction: Partial<ClusterProduction>,
  ): Promise<ClusterProduction> {
    console.log(name);
    const clusterProductionDB = await this.projectRepository.clusterProduction(name).get();
    const {clusterNamespace} = clusterProductionDB;
    const clusterDB = await this.clusterRepository.findOne({
      where: {
        namespace: clusterNamespace,
      },
      include: ['gitBranch'],
    });
    if (!clusterDB) throw new HttpErrors.BadRequest('Cluster not found.');
    const containersToDelete = await this.containerRepository.find({
      where: {
        clusterNamespace,
      }
    });
    clusterProductionDB.numberOfInstances = clusterProduction.numberOfInstances || clusterProductionDB.numberOfInstances;
    clusterProductionDB.domain = clusterProduction.domain || clusterProductionDB.domain;
    await this.clusterProductionRepository.updateById(clusterProductionDB.id, clusterProduction);
    const background = async () => {
      await this.projectService.deployProduction(clusterDB, clusterProductionDB);
      await this.dnsmasqService.configSync();
      await this.dnsmasqService.restartService();
      await this.nginxService.reloadService();
      await Promise.all(containersToDelete.map((container) => {
        return this.dockerService.clusterContainerRemove(container);
      }));
    }
    background().then(() => {
      console.log('path project cluster production success');
    }).catch((err) => {
      console.error(err);
    });
    return this.clusterProductionRepository.findById(clusterProductionDB.id);
  }
}
