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
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {
  Container,
  PipelineStatus
} from '../models';
import {ContainerRepository} from '../repositories';

export class ContainerPipelineStatusController {
  constructor(
    @repository(ContainerRepository) protected containerRepository: ContainerRepository,
  ) { }

  @get('/containers/{id}/container-pipeline-status', {
    responses: {
      '200': {
        description: 'Container has one PipelineStatus',
        content: {
          'application/json': {
            schema: getModelSchemaRef(PipelineStatus),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<PipelineStatus>,
  ): Promise<PipelineStatus> {
    return this.containerRepository.pipelineStatus(id).get(filter);
  }

  @post('/containers/{id}/container-pipeline-status', {
    responses: {
      '200': {
        description: 'Container model instance',
        content: {'application/json': {schema: getModelSchemaRef(PipelineStatus)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Container.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PipelineStatus, {
            title: 'NewPipelineStatusInContainer',
            exclude: ['id'],
            optional: ['containerNamespace']
          }),
        },
      },
    }) PipelineStatus: Omit<PipelineStatus, 'id'>,
  ): Promise<PipelineStatus> {
    return this.containerRepository.pipelineStatus(id).create(PipelineStatus);
  }

  @patch('/containers/{id}/container-pipeline-status', {
    responses: {
      '200': {
        description: 'Container.PipelineStatus PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PipelineStatus, {partial: true}),
        },
      },
    })
    PipelineStatus: Partial<PipelineStatus>,
    @param.query.object('where', getWhereSchemaFor(PipelineStatus)) where?: Where<PipelineStatus>,
  ): Promise<Count> {
    return this.containerRepository.pipelineStatus(id).patch(PipelineStatus, where);
  }

  @del('/containers/{id}/container-pipeline-status', {
    responses: {
      '200': {
        description: 'Container.PipelineStatus DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(PipelineStatus)) where?: Where<PipelineStatus>,
  ): Promise<Count> {
    return this.containerRepository.pipelineStatus(id).delete(where);
  }
}
