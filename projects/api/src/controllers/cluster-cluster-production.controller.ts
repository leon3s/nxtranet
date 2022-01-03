import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  HttpErrors,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import fs from 'fs';
import mustache from 'mustache';
import path from 'path';
import {DockerServiceBindings, NginxServiceBindings, ProxiesServiceBindings} from '../keys';
import {
  Cluster,
  ClusterProduction
} from '../models';
import {ClusterProductionRepository, ClusterRepository, PortMappingRepository, PortRepository} from '../repositories';
import {DockerService} from '../services/docker-service';
import {NginxService} from '../services/nginx-service';
import {ProxiesService} from '../services/proxies-service';

export class ClusterClusterProductionController {
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
    @repository(ClusterRepository)
    protected clusterRepository: ClusterRepository,
    @inject(DockerServiceBindings.DOCKER_SERVICE)
    protected dockerService: DockerService,
  ) { }

  @get('/clusters/{namespace}/cluster-production', {
    responses: {
      '200': {
        description: 'Cluster has one ClusterProduction',
        content: {
          'application/json': {
            schema: getModelSchemaRef(ClusterProduction),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('namespace') namespace: string,
    @param.query.object('filter') filter?: Filter<ClusterProduction>,
  ): Promise<ClusterProduction> {
    return this.clusterRepository.production(namespace).get(filter);
  }

  @post('/clusters/{namespace}/cluster-production', {
    responses: {
      '200': {
        description: 'Cluster model instance',
        content: {'application/json': {schema: getModelSchemaRef(ClusterProduction)}},
      },
    },
  })
  async create(
    @param.path.string('namespace') namespace: typeof Cluster.prototype.namespace,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ClusterProduction, {
            title: 'NewClusterProductionInCluster',
            exclude: ['id', 'clusterNamespace'],
          }),
        },
      },
    }) clusterProduction: Omit<ClusterProduction, 'namespace'>,
  ): Promise<ClusterProduction> {
    const clusterDB = await this.clusterRepository.findOne({
      where: {
        namespace,
      },
      include: ['gitBranch'],
    });
    if (!clusterDB || !clusterDB.gitBranch) {
      throw new HttpErrors
        .NotAcceptable('Cluster for given namespace isn\'t found');
    }
    let clusterProdDB = await this.clusterProductionRepository.findOne({
      where: {
        clusterNamespace: namespace,
      }
    });
    if (clusterProdDB) {
      throw new HttpErrors.NotAcceptable('Targeted Cluster has already production settup.');
    }
    const nginxPorts: number[] = [];
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
    await this.nginxService.testConfig();
    const {clusterDeploy} = this.dockerService;
    const {productionDomains} = this.proxiesService;
    async function background() {
      if (!clusterDB || !clusterDB.gitBranch) return;
      // deploy instance in background //
      const ports = [];
      for (let i = 0; i < clusterProduction.numberOfInstances; i++) {
        const container = await clusterDeploy({
          namespace: clusterDB.namespace,
          branch: clusterDB.gitBranch?.name,
          isProduction: true,
          isGeneratedDeploy: true,
        });
        console.log(container.appPort);
        ports.push({
          app: container.appPort,
          listen: nginxPorts[i],
        });
      }
      productionDomains(ports);
    }
    background().then(() => {
      console.log('success');
    }).catch((err) => {
      console.error('background deploy fail: ', err);
    });
    return clusterProdDB;
  }

  @patch('/clusters/{namespace}/cluster-production', {
    responses: {
      '200': {
        description: 'Cluster.ClusterProduction PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('namespace') namespace: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ClusterProduction, {partial: true}),
        },
      },
    })
    clusterProduction: Partial<ClusterProduction>,
    @param.query.object('where', getWhereSchemaFor(ClusterProduction)) where?: Where<ClusterProduction>,
  ): Promise<Count> {
    return this.clusterRepository.production(namespace).patch(clusterProduction, where);
  }

  @del('/clusters/{namespace}/cluster-production', {
    responses: {
      '200': {
        description: 'Cluster.ClusterProduction DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('namespace') namespace: string,
    @param.query.object('where', getWhereSchemaFor(ClusterProduction)) where?: Where<ClusterProduction>,
  ): Promise<Count> {
    return this.clusterRepository.production(namespace).delete(where);
  }
}
