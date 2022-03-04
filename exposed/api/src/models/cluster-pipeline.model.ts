import {Entity, model, property} from '@loopback/repository';

@model()
export class ClusterPipeline extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    mongodb: {dataType: 'ObjectID'},
  })
  id: string;

  @property({
    type: 'string',
  })
  clusterId?: string;

  @property({
    type: 'string',
  })
  pipelineId?: string;

  constructor(data?: Partial<ClusterPipeline>) {
    super(data);
  }
}

export interface ClusterPipelineRelations {
  // describe navigational properties here
}

export type ClusterPipelineWithRelations = ClusterPipeline & ClusterPipelineRelations;
