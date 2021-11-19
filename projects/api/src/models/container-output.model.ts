import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    strict: true,
  }
})
export class ContainerOutput extends Entity {
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
  })
  containerNamespace: string;

  @property({
    type: 'string',
  })
  exe: string;

  @property({
    type: 'string',
  })
  cwd: string;

  @property({
    type: 'boolean',
  })
  isFirst: boolean;

  @property({
    type: 'boolean',
  })
  isLast: boolean;

  @property({
    type: 'string',
  })
  signal?: string;

  @property({
    type: 'string',
  })
  signalDescription?: string;

  @property({
    type: 'number',
  })
  exitCode?: number;

  @property.array(String)
  args: string[];

  @property({
    type: 'string',
  })
  stdout?: string;

  @property({
    type: 'string',
  })
  stderr?: string;

  constructor(data?: Partial<ContainerOutput>) {
    super(data);
  }
}

export interface ContainerOutputRelations {
  // describe navigational properties here
}

export type ContainerOutputWithRelations = ContainerOutput & ContainerOutputRelations;
