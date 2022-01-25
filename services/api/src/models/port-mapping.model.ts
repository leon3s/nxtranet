import {Entity, model, property} from '@loopback/repository';

@model()
export class PortMapping extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    mongodb: {
      dataType: 'ObjectID',
    },
  })
  id: string;

  @property({
    type: 'string',
  })
  serviceId?: string;

  @property({
    type: 'string',
  })
  clusterProductionId?: string;

  @property({
    type: 'string',
  })
  portId?: string;

  constructor(data?: Partial<PortMapping>) {
    super(data);
  }
}

export interface PortMappingRelations {
  // describe navigational properties here
}

export type PortMappingWithRelations = PortMapping & PortMappingRelations;
