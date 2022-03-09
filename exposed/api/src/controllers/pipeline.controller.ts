import {
  Filter,
  repository
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef, HttpErrors, param
} from '@loopback/rest';
import {
  Pipeline
} from '../models';
import {PipelineRepository} from '../repositories';

export class PipelineController {
  constructor(
    @repository(PipelineRepository) protected pipelineRepository: PipelineRepository,
  ) { }

  /** DASHBOARD IN USE */
  @get('/pipelines/{namespace}', {
    description: 'Get array of pipelines for given project namespace',
    responses: {
      '200': {
        description: 'Array of pipeline for a Project',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Pipeline, {includeRelations: true})
          },
        },
      },
    },
  })
  async findByNamespace(
    @param.path.string('namespace') namespace: string,
    @param.filter(Pipeline) filter?: Filter<Pipeline>,
  ): Promise<Pipeline> {
    const pipeline = await this.pipelineRepository.findOne({
      ...(filter || {}),
      where: {
        namespace,
      }
    });
    if (!pipeline) {
      throw new HttpErrors.NotFound(`Pipeline not found for give namespace`);
    }
    return pipeline;
  }

  @del('/pipelines/{namespace}', {
    responses: {
      '200': {
        description: 'Project.Cluster DELETE success count',
      },
    },
  })
  async deleteByNamespace(
    @param.path.string('namespace') namespace: string,
  ): Promise<void> {
    const pipeline = await this.pipelineRepository.findOne({
      where: {
        namespace,
      }
    });
    if (!pipeline) {
      throw new HttpErrors.NotFound(`Pipeline not found for give namespace`);
    }
    await this.pipelineRepository.delete(pipeline);
  }
}
