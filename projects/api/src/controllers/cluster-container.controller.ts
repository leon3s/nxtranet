import {inject} from '@loopback/context';
import {
  CountSchema, repository
} from '@loopback/repository';
import {
  del, param
} from '@loopback/rest';
import {DockerServiceBindings} from '../keys';
import {ClusterRepository} from '../repositories';
import {DockerService} from '../services/docker-service';

export class ClusterContainerController {
  constructor(
    @inject(DockerServiceBindings.DOCKER_SERVICE) protected dockerService: DockerService,
    @repository(ClusterRepository) protected clusterRepository: ClusterRepository,
  ) { }

  @del('/clusters/{namespace}/containers/{name}', {
    responses: {
      '200': {
        description: 'Cluster.Container DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('namespace') namespace: string,
    @param.path.string('name') name: string,
  ): Promise<void> {
    await this.dockerService.clusterContainerRemove(namespace, name);
  }
}
