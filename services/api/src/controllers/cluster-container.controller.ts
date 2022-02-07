import {inject} from '@loopback/context';
import {
  CountSchema, repository
} from '@loopback/repository';
import {
  del, HttpErrors, param
} from '@loopback/rest';
import {DockerServiceBindings} from '../keys';
import {ContainerRepository} from '../repositories';
import {DockerService} from '../services/docker-service';

export class ClusterContainerController {
  constructor(
    @inject(DockerServiceBindings.DOCKER_SERVICE) protected dockerService: DockerService,
    @repository(ContainerRepository) protected containerRepository: ContainerRepository,
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
    const container = await this.containerRepository.findOne({
      where: {
        name,
        clusterNamespace: namespace,
      }
    });
    if (!container) throw new HttpErrors.NotAcceptable('Container not found');
    await this.dockerService.clusterContainerRemove(container);
  }
}
