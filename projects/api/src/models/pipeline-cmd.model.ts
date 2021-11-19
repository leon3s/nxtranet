import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    strict: true,
  }
})
export class PipelineCmd extends Entity {
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
  pipelineNamespace: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property.array(String)
  args: string[];

  constructor(data?: Partial<PipelineCmd>) {
    super(data);
  }
}

export interface PipelineCmdRelations {
  // describe navigational properties here
}

export type PipelineCmdWithRelations = PipelineCmd & PipelineCmdRelations;
