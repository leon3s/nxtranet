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
  Pipeline,
  PipelineCmd
} from '../models';
import {PipelineRepository} from '../repositories';

export class PipelineCmdController {
  constructor(
    @repository(PipelineRepository) protected pipelineRepository: PipelineRepository,
  ) { }

  @get('/pipelines/{namespace}/cmds', {
    responses: {
      '200': {
        description: 'Array of PipelineCmd has many PipelineCmd',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(PipelineCmd)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('namespace') namespace: typeof Pipeline.prototype.namespace,
    @param.query.object('filter') filter?: Filter<PipelineCmd>,
  ): Promise<PipelineCmd[]> {
    return this.pipelineRepository.commands(namespace).find(filter);
  }

  @post('/pipelines/{namespace}/cmds', {
    responses: {
      '200': {
        description: 'PipelineCmd model instance',
        content: {'application/json': {schema: getModelSchemaRef(PipelineCmd)}},
      },
    },
  })
  async create(
    @param.path.string('namespace') namespace: typeof Pipeline.prototype.namespace,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PipelineCmd, {
            title: 'NewPipelineCmdInPipelineCmd',
            exclude: ['pipelineNamespace', 'id'],
          }),
        },
      },
    }) pipelineCmd: Partial<PipelineCmd>,
  ): Promise<PipelineCmd> {
    const cluster = await this.pipelineRepository.findOne({
      where: {
        namespace,
      }
    });
    if (!cluster) throw new HttpErrors.NotFound('PipelineCmd not found, namespace not valid.');
    pipelineCmd.pipelineNamespace = namespace;
    return this.pipelineRepository.commands(namespace).create(pipelineCmd);
  }

  @patch('/pipelines/{namespace}/cmds', {
    responses: {
      '200': {
        description: 'PipelineCmd.PipelineCmd PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('namespace') namespace: typeof Pipeline.prototype.namespace,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PipelineCmd, {partial: true}),
        },
      },
    })
    pipelineCmd: Partial<PipelineCmd>,
    @param.query.object('where', getWhereSchemaFor(PipelineCmd)) where?: Where<PipelineCmd>,
  ): Promise<Count> {
    return this.pipelineRepository.commands(namespace).patch(pipelineCmd, where);
  }

  @del('/pipelines/{namespace}/cmds', {
    responses: {
      '200': {
        description: 'PipelineCmd.PipelineCmd DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('namespace') namespace: typeof Pipeline.prototype.namespace,
    @param.query.object('where', getWhereSchemaFor(PipelineCmd)) where?: Where<PipelineCmd>,
  ): Promise<Count> {
    return this.pipelineRepository.commands(namespace).delete(where);
  }
}
