import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class ContainerStat extends Entity {

  // Define well-known properties here
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
  dockerID: string;

  // Indexer property to allow additional data to just push/
  // container.stats() response inside we gonna cast type of this model to Docker.ContainerStat;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<ContainerStat>) {
    super(data);
  }
}

export interface ContainerStatRelations {
  // describe navigational properties here
}

export type ContainerStatWithRelations = ContainerStat & ContainerStatRelations;
