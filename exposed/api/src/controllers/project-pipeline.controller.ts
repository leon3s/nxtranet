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
import {
  Pipeline, Project
} from '../models';
import {ProjectRepository} from '../repositories';

export class ProjectPipelineController {
  constructor(
    @repository(ProjectRepository) protected projectRepository: ProjectRepository,
  ) { }

  @get('/projects/{name}/pipelines', {
    description: 'Get array of pipelines for given project name',
    responses: {
      '200': {
        description: 'Array of pipeline for a Project',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Pipeline, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.path.string('name') name: string,
    @param.filter(Pipeline) filter?: Filter<Pipeline>,
  ): Promise<Pipeline[]> {
    return this.projectRepository.pipelines(name).find(filter);
  }

  @post('/projects/{name}/pipelines', {
    description: 'Create a new pipeline for given project name',
    responses: {
      '200': {
        description: 'Project model instance',
        content: {'application/json': {schema: getModelSchemaRef(Pipeline)}},
      },
    },
  })
  async create(
    @param.path.string('name') name: typeof Project.prototype.name,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Pipeline, {
            title: 'NewPipelineInProject',
            exclude: ['id', 'projectName', 'namespace'],
          }),
        },
      },
    }) pipeline: Partial<Pipeline>,
  ): Promise<Pipeline> {
    const project = await this.projectRepository.findOne({
      where: {
        name,
      }
    });
    if (!project) throw new HttpErrors.NotFound('Project name is not valid.');
    pipeline.projectName = name;
    pipeline.namespace = `${name}.${pipeline.name}`
    return this.projectRepository.pipelines(name).create(pipeline);
  }

  @patch('/projects/{name}/pipelines', {
    description: 'Update pipeline for given project name',
    responses: {
      '200': {
        description: 'Project.Pipeline PATCH success count',
        content: {'application/json': {schema: getModelSchemaRef(Pipeline)}},
      },
    },
  })
  async patch(
    @param.path.string('name') name: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Pipeline, {
            title: 'UpdatePipelineInProject',
            exclude: ['id', 'projectName', 'namespace'],
          }),
        },
      },
    })
    pipeline: Partial<Pipeline>,
    @param.query.object('where', getWhereSchemaFor(Pipeline)) where?: Where<Pipeline>,
  ): Promise<Count> {
    return this.projectRepository.pipelines(name).patch(pipeline, where);
  }

  @del('/projects/{name}/pipelines', {
    description: 'Delete pipeline for given project name',
    responses: {
      '200': {
        description: 'Project.Pipeline DELETE success count',
        content: {
          'application/json': {
            schema: CountSchema,
          }
        },
      },
    },
  })
  async delete(
    @param.path.string('name') name: string,
    @param.query.object('where', getWhereSchemaFor(Pipeline)) where?: Where<Pipeline>,
  ): Promise<Count> {
    return this.projectRepository.pipelines(name).delete(where);
  }
}
