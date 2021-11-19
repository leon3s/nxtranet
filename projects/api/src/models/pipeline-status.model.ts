import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Container} from './container.model';
import {Pipeline} from './pipeline.model';

export enum PipelineStatusEnum {
  STARTING = 'starting',
  PASSED = 'passed',
  FAILED = 'failed',
  ONLINE = 'online',
}

@model({
  settings: {
    strict: true,
  }
})
export class PipelineStatus extends Entity {
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
    jsonSchema: {
      enum: Object.values(PipelineStatusEnum),
    },
  })
  value: PipelineStatusEnum;

  @property({
    type: 'string'
  })
  error?: string;

  @belongsTo(() => Pipeline, {
    keyFrom: 'pipelineNamespace',
    keyTo: 'namespace',
    name: 'pipeline',
  })
  pipelineNamespace: string;

  pipeline?: Pipeline;

  @property({
    type: 'string',
  })
  containerNamespace: string;

  container?: Container;

  constructor(data?: Partial<PipelineStatus>) {
    super(data);
  }
}

export interface PipelineStatusRelations {
  // describe navigational properties here
}

export type PipelineStatusWithRelations = PipelineStatus & PipelineStatusRelations;
