import {inject} from '@loopback/context';
import {
  repository
} from '@loopback/repository';
import {
  getModelSchemaRef, param, post,
  requestBody
} from '@loopback/rest';
import {DockerServiceBindings, NginxServiceBindings, ProxiesServiceBindings} from '../keys';
import {
  Cluster, Container
} from '../models';
import {ClusterRepository} from '../repositories';
import {DockerService} from '../services/docker-service';
import {NginxService} from '../services/nginx-service';
import {ProxiesService} from '../services/proxies-service';

export class ClusterController {
  constructor(
    @inject(ProxiesServiceBindings.PROXIES_SERVICE)
    protected subdomainService: ProxiesService,
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
    return this.dockerService.clusterDeploy({
      namespace,
      isProduction: false,
      branch: payload.branch,
      isGeneratedDeploy: false,
    });
  }
}
