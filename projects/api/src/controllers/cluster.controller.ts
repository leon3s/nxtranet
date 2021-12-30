import {inject} from '@loopback/context';
import {
  repository
} from '@loopback/repository';
import {
  getModelSchemaRef, HttpErrors, param, post,
  requestBody
} from '@loopback/rest';
import fs from 'fs';
import mustache from 'mustache';
import path from 'path';
import {DockerServiceBindings, NginxServiceBindings, SubdomainServiceBindings} from '../keys';
import {
  Cluster, Container
} from '../models';
import {ClusterRepository} from '../repositories';
import {DockerService} from '../services/docker-service';
import {NginxService} from '../services/nginx-service';
import {SubdomainService} from '../services/subdomain-service';

export class ClusterController {
  constructor(
    @inject(SubdomainServiceBindings.SUBDOMAIN_SERVICE)
    protected subdomainService: SubdomainService,
    @inject(NginxServiceBindings.NGINX_SERVICE)
    protected nginxService: NginxService,
    @repository(ClusterRepository)
    protected clusterRepository: ClusterRepository,
    @inject(DockerServiceBindings.DOCKER_SERVICE)
    protected dockerService: DockerService,
  ) { }

  @post('/clusters/{namespace}/deploy', {
    responses: {
      '200': {
        description: 'Deploy a container inside cluster for given branch',
        content: {'application/json': {schema: getModelSchemaRef(Container)}},
      },
    },
  })
  async deploy(
    @param.path.string('namespace') namespace: typeof Cluster.prototype.namespace,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['branch'],
            properties: {
              branch: {type: 'string'},
            },
          }
        },
      },
    }) payload: {branch: string},
  ): Promise<Container> {
    return this.dockerService.clusterDeploy(namespace, payload.branch);
  }

  @post('/clusters/{namespace}/enable-production', {
    responses: {
      '200': {
        description: 'Enable production for given cluster',
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: 'Ok',
            }
          }
        }
      }
    }
  })
  async enableProduction(
    @param.path.string('namespace') namespace: typeof Cluster.prototype.namespace,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['domainName', 'numberOfInstance'],
            properties: {
              numberOfInstance: {
                type: 'number',
                example: 4,
              },
            },
          }
        }
      }
    }) payload: {domainName: string, numberOfInstance: number}
  ): Promise<string> {
    const clusterDB = await this.clusterRepository.findOne({
      where: {
        namespace,
      },
      include: ['gitBranch'],
    });
    console.log(clusterDB);
    if (!clusterDB || !clusterDB.gitBranch) {
      throw new HttpErrors
        .NotAcceptable('Cluster for given namespace isn\'t found');
    }
    clusterDB.isProduction = true;
    clusterDB.numberOfInstance = payload.numberOfInstance;
    const d = fs.readFileSync(path.join(__dirname, '../../../../config/nginx/template.production.com')).toString();
    const nginxPorts = [6453, 3422, 5442];
    const render = mustache.render(d, {
      ports: nginxPorts,
      domain_name: 'express-test-deploy.com',
    });
    // console.log(d);
    // console.log(render);
    await this.nginxService.writeSiteAvaible('express-test-deploy.com', render);
    await this.nginxService.testConfig();
    await this.clusterRepository.updateById(clusterDB.id, {
      isProduction: true,
      numberOfInstance: payload.numberOfInstance,
    });
    const {clusterDeploy} = this.dockerService;
    const {productionDomains} = this.subdomainService;
    async function background() {
      if (!clusterDB || !clusterDB.gitBranch) return;
      // deploy instance in background //
      const ports = [];
      for (let i = 0; i < payload.numberOfInstance; i++) {
        const container = await clusterDeploy(clusterDB.namespace, clusterDB.gitBranch?.name);
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
    // await this.nginxService.restartService();
    return "ok";
  }
}
