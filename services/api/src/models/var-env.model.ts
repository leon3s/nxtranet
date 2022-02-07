import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    strict: true,
    indexes: {
      uniqueNamespace: {
        keys: {
          namespace: 1,
        },
        options: {
          unique: true,
        },
      },
    },
  }
})
export class EnvVar extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    mongodb: {dataType: 'ObjectID'},
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
  namespace: string;

  @property({
    type: 'string',
    required: true,
  })
  clusterNamespace: string;

  @property({
    type: 'string',
    required: true,
  })
  key: string;

  @property({
    type: 'string',
    required: true,
  })
  value: string;

  constructor(data?: Partial<EnvVar>) {
    super(data);
  }
}

export interface EnvVarRelations {
  // describe navigational properties here
}

export type EnvVarWithRelations = EnvVar & EnvVarRelations;
