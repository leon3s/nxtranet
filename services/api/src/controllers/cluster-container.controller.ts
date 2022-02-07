import {inject} from '@loopback/context';
import {
  CountSchema, repository
} from '@loopback/repository';
import {
  del, HttpErrors, param
} from '@loopback/rest';
import {ProjectServiceBindings} from '../keys';
import {ContainerRepository} from '../repositories';
import ProjectService from '../services/project-service';

export class ClusterContainerController {
  constructor(
    @inject(ProjectServiceBindings.PROJECT_SERVICE) protected projectService: ProjectService,
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
    await this.projectService.removeContainer(container);
  }
}
