import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    strict: true,
  }
})
export class Port extends Entity {
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
    type: 'number',
    required: true,
  })
  number: number;

  constructor(data?: Partial<Port>) {
    super(data);
  }
}

export interface PortRelations {
  // describe navigational properties here
}

export type PortWithRelations = Port & PortRelations;
