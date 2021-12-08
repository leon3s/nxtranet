import {inject} from '@loopback/context';
import {
  repository
} from '@loopback/repository';
import {
  getModelSchemaRef, HttpErrors, param, post,
  requestBody
} from '@loopback/rest';
import {DockerServiceBindings} from '../keys';
import {
  Cluster, Container
} from '../models';
import {ClusterRepository} from '../repositories';
import {DockerService} from '../services/docker-service';

export class ClusterController {
  constructor(
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
              domainName: {
                type: 'string',
                example: "myapp.com",
              },
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
    });
    if (!clusterDB) {
      throw new HttpErrors
        .NotAcceptable('Cluster for given namespace isn\'t found');
    }
    clusterDB.isProduction = true;
    clusterDB.numberOfInstance = payload.numberOfInstance;
    await this.clusterRepository.updateById(clusterDB.id, clusterDB);
    return "ok";
  }
}
