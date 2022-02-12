import {Entity, model, property} from '@loopback/repository';

@model()
export class ClusterProduction extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    mongodb: {dataType: 'ObjectID'},
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  domain: string;

  @property({
    type: 'string',
    required: true,
  })
  host: string;

  @property({
    type: 'number',
    required: true,
  })
  numberOfInstances: number;

  @property({
    type: 'string',
  })
  clusterNamespace?: string;

  @property({
    type: 'string',
  })
  projectName: string;

  constructor(data?: Partial<ClusterProduction>) {
    super(data);
  }
}

export interface ClusterProductionRelations {
  // describe navigational properties here
}

export type ClusterProductionWithRelations = ClusterProduction & ClusterProductionRelations;
