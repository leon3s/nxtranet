import {
  CountSchema, repository
} from '@loopback/repository';
import {
  del, getModelSchemaRef, HttpErrors, param, post
} from '@loopback/rest';
import {Pipeline} from '../models';
import {ClusterPipelineRepository, PipelineRepository} from '../repositories';

export class ClusterPipelineLinkController {
  constructor(
    @repository(PipelineRepository)
    protected pipelineRepository: PipelineRepository,
    @repository(ClusterPipelineRepository) protected clusterPipelineRepository: ClusterPipelineRepository,
  ) { }

  @post('/clusters/{clusterId}/pipelines/{pipelineId}/link', {
    responses: {
      '200': {
        description: 'create a Pipeline Link model instance',
        content: {'application/json': {schema: getModelSchemaRef(Pipeline)}},
      },
    },
  })
  async create(
    @param.path.string('clusterId') clusterId: string,
    @param.path.string('pipelineId') pipelineId: string
  ): Promise<Pipeline> {
    await this.clusterPipelineRepository.create({
      clusterId,
      pipelineId,
    });
    return this.pipelineRepository.findById(pipelineId);
  }

  @del('/clusters/{clusterId}/pipelines/{pipelineId}/link', {
    responses: {
      '200': {
        description: 'Cluster.Pipeline DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('clusterId') clusterId: string,
    @param.path.string('pipelineId') pipelineId: string
  ): Promise<void> {
    const clusterPipeline = await this.clusterPipelineRepository.findOne({
      where: {
        clusterId,
        pipelineId,
      },
    });
    if (!clusterPipeline) throw new HttpErrors.NotFound('Cluster pipeline not found');
    await this.clusterPipelineRepository.delete(clusterPipeline);
  }
}
