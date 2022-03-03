import {Entity, model, property} from '@loopback/repository';

@model()
export class ClusterPipeline extends Entity {

  constructor(data?: Partial<ClusterPipeline>) {
    super(data);
  }
}

export interface ClusterPipelineRelations {
  // describe navigational properties here
}

export type ClusterPipelineWithRelations = ClusterPipeline & ClusterPipelineRelations;
