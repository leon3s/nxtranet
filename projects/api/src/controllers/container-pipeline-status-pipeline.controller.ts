import {
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param
} from '@loopback/rest';
import {
  Pipeline, PipelineStatus
} from '../models';
import {PipelineStatusRepository} from '../repositories';

export class PipelineStatusPipelineController {
  constructor(
    @repository(PipelineStatusRepository)
    public pipelineStatusRepository: PipelineStatusRepository,
  ) { }

  @get('/container-pipeline-statuses/{id}/pipeline', {
    responses: {
      '200': {
        description: 'Pipeline belonging to PipelineStatus',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Pipeline)},
          },
        },
      },
    },
  })
  async getPipeline(
    @param.path.string('id') id: typeof PipelineStatus.prototype.id,
  ): Promise<Pipeline> {
    return this.pipelineStatusRepository.pipeline(id);
  }
}
