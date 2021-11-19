import {Entity, hasMany, model, property} from '@loopback/repository';
import {PipelineCmd} from './pipeline-cmd.model';

@model({
  settings: {
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
export class Pipeline extends Entity {
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
  projectName: string;

  @property({
    type: 'string',
    require: true,
  })
  namespace: string;

  @property({
    type: 'string',
    required: true,
  })
  color: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @hasMany(() => PipelineCmd, {
    keyFrom: 'namespace',
    keyTo: 'pipelineNamespace',
    name: 'commands',
  })
  commands?: PipelineCmd[];

  constructor(data?: Partial<Pipeline>) {
    super(data);
  }
}

export interface PipelineRelations {
  // describe navigational properties here
}

export type PipelineWithRelations = Pipeline & PipelineRelations;
