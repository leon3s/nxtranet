import {
  Filter,
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, HttpErrors, param
} from '@loopback/rest';
import {
  Container
} from '../models';
import {ContainerRepository} from '../repositories';

export class ProjectContainerController {
  constructor(
    @repository(ContainerRepository) protected containerRepo: ContainerRepository,
  ) { }

  @get('/projects/{name}/containers', {
    description: 'Get containers for given project',
    responses: {
      '200': {
        description: 'Array of Project has many Container',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Container)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('name') name: string,
    @param.query.object('filter') filter?: Filter<Container>,
  ): Promise<Container[]> {
    return this.containerRepo.find({
      ...(filter || {}),
      where: {
        ...(filter?.where || {}),
        projectName: name,
      }
    })
  }

  @get('/projects/{name}/containers/{containerName}', {
    description: 'Get containers for given project',
    responses: {
      '200': {
        description: 'Get Container by name for specify project',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Container),
          },
        },
      },
    },
  })
  async findByName(
    @param.path.string('name') name: string,
    @param.path.string('containerName') containerName: string,
    @param.query.object('filter') filter?: Filter<Container>,
  ): Promise<Container> {
    const container = await this.containerRepo.findOne({
      ...(filter || {}),
      where: {
        ...(filter?.where || {}),
        projectName: name,
        name: containerName,
      }
    });
    if (!container) {
      throw new HttpErrors.NotFound('Container not found.');
    }
    return container;
  }
}
