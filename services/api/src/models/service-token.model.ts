import {Entity, model, property} from '@loopback/repository';

@model()
export class ServiceToken extends Entity {
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
    type: 'Date',
    defaultFn: 'now',
  })
  creationDate?: Date;

  @property({
    type: 'string',
    required: true,
  })
  serviceName: string;

  @property({
    type: 'string',
    required: true,
  })
  value: string;

  constructor(data?: Partial<ServiceToken>) {
    super(data);
  }
}

export interface ServiceTokenRelations {
  // describe navigational properties here
}

export type ServiceTokenWithRelations = ServiceToken & ServiceTokenRelations;
