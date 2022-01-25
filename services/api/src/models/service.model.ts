import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {PortMapping} from './port-mapping.model';
import {Port} from './port.model';

@model({
  settings: {
    strict: true,
    indexes: {
      uniqueName: {
        keys: {
          name: 1,
        },
        options: {
          unique: true,
        },
      },
    },
  }
})
export class Service extends Entity {
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
  name: string;

  @property({
    type: 'string',
    default: '127.0.0.1',
  })
  host?: number;

  @belongsTo(() => Port)
  portId: string;

  @hasMany(() => Port, {through: {model: () => PortMapping}})
  ports: Port[];

  constructor(data?: Partial<Service>) {
    super(data);
  }
}

export interface ServiceRelations {
  // describe navigational properties here
}

export type ServiceWithRelations = Service & ServiceRelations;
