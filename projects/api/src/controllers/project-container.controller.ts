import {
  Filter,
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param
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
    console.log('filter !')
    return this.containerRepo.find({
      ...(filter || {}),
      where: {
        ...(filter?.where || {}),
        projectName: name,
      }
    })
  }
}
