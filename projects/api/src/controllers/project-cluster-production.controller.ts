import {inject} from '@loopback/core';
import {
  Filter,
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, HttpErrors,
  param, post,
  requestBody
} from '@loopback/rest';
import fs from 'fs';
import mustache from 'mustache';
import path from 'path';
import {
  DnsmasqServiceBindings,
  DockerServiceBindings,
  NginxServiceBindings,
  ProxiesServiceBindings
} from '../keys';
import {
  ClusterProduction, Project
} from '../models';
import {
  ClusterProductionRepository,
  ClusterRepository,
  PortMappingRepository,
  PortRepository,
  ProjectRepository
} from '../repositories';
import {DnsmasqService} from '../services/dnsmasq-service';
import {DockerService} from '../services/docker-service';
import {NginxService} from '../services/nginx-service';
import {ProxiesService} from '../services/proxies-service';

export class ProjectClusterProductionController {
  constructor(
    @repository(ClusterProductionRepository)
    protected clusterProductionRepository: ClusterProductionRepository,
    @repository(PortMappingRepository)
    protected portMappingRepository: PortMappingRepository,
    @repository(PortRepository)
    protected portRepository: PortRepository,
    @inject(ProxiesServiceBindings.PROXIES_SERVICE)
    protected proxiesService: ProxiesService,
    @inject(NginxServiceBindings.NGINX_SERVICE)
    protected nginxService: NginxService,
    @inject(DnsmasqServiceBindings.DNSMASQ_SERVICE)
    protected dnsmasqService: DnsmasqService,
    @repository(ClusterRepository)
    protected clusterRepository: ClusterRepository,
    @inject(DockerServiceBindings.DOCKER_SERVICE)
    protected dockerService: DockerService,
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
        description: 'Project model instance',
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
    const nginxPorts: number[] = [];
    clusterProduction.projectName = name;
    clusterProdDB = await this.clusterRepository
      .production(clusterDB.namespace)
      .create(clusterProduction);
    for (let i = 0; i < clusterProduction.numberOfInstances; i++) {
      const port = await this.portRepository.getFreeNonReservedPort();
      const portDB = await this.portRepository.createIfNotExist(port);
      await this.portMappingRepository.create({
        portId: portDB.id,
        clusterProductionId: clusterProdDB.id,
      });
      nginxPorts.push(port);
    }
    const d = fs.readFileSync(path.join(__dirname, '../../../../config/nginx/template.production.com')).toString();
    const render = mustache.render(d, {
      ports: nginxPorts,
      domain_name: clusterProdDB.domain,
    });
    await this.nginxService.writeSiteAvaible(clusterProdDB.domain, render);
    // await this.nginxService.testConfig();
    const background = async () => {
      if (!clusterProdDB) return;
      if (!clusterDB || !clusterDB.gitBranch) return;
      const ports = [];
      for (let i = 0; i < clusterProduction.numberOfInstances; i++) {
        const container = await this.dockerService.clusterDeploy({
          namespace: clusterDB.namespace,
          branch: clusterDB.gitBranch?.name,
          isProduction: true,
          isGeneratedDeploy: true,
        });
        ports.push({
          app: container.appPort,
          listen: nginxPorts[i],
        });
      }
      await this.dnsmasqService.configSync();
      await this.proxiesService.updateDomains();
      this.proxiesService.productionDomains(ports);
      await this.dnsmasqService.restartService();
      await this.nginxService.deploySiteAvaible(clusterProdDB.domain);
      // await this.nginxService.reloadService();
    }

    background().then(() => {
      console.log('success');
    }).catch((err) => {
      console.error('background deploy fail: ', err);
    });
    return clusterProdDB;
    // return this.projectRepository.clusterProduction(id).create(clusterProduction);
  }

  // @patch('/projects/{id}/cluster-production', {
  //   responses: {
  //     '200': {
  //       description: 'Project.ClusterProduction PATCH success count',
  //       content: {'application/json': {schema: CountSchema}},
  //     },
  //   },
  // })
  // async patch(
  //   @param.path.string('id') id: string,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(ClusterProduction, {partial: true}),
  //       },
  //     },
  //   })
  //   clusterProduction: Partial<ClusterProduction>,
  //   @param.query.object('where', getWhereSchemaFor(ClusterProduction)) where?: Where<ClusterProduction>,
  // ): Promise<Count> {
  //   return this.projectRepository.clusterProduction(id).patch(clusterProduction, where);
  // }
  // @del('/projects/{id}/cluster-production', {
  //   responses: {
  //     '200': {
  //       description: 'Project.ClusterProduction DELETE success count',
  //       content: {'application/json': {schema: CountSchema}},
  //     },
  //   },
  // })
  // async delete(
  //   @param.path.string('id') id: string,
  //   @param.query.object('where', getWhereSchemaFor(ClusterProduction)) where?: Where<ClusterProduction>,
  // ): Promise<Count> {
  //   return this.projectRepository.clusterProduction(id).delete(where);
  // }
}
