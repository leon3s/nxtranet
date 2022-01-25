import {Entity, model, property} from '@loopback/repository';

@model()
export class ContainerState extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    mongodb: {dataType: 'ObjectID'},
  })
  id: string;

  @property({
    type: 'string',
  })
  containerNamespace?: string;

  @property({
    type: 'string',
  })
  Status: 'exited' | 'running';

  @property({
    type: 'boolean',
  })
  Running: boolean;

  @property({
    type: 'boolean',
  })
  Paused: boolean;

  @property({
    type: 'boolean',
  })
  Restarting: boolean;

  @property({
    type: 'boolean',
  })
  OOMKilled: false;

  @property({
    type: 'boolean',
  })
  Dead: boolean;

  @property({
    type: 'number',
  })
  Pid: number;

  @property({
    type: 'number',
  })
  ExitCode: number;

  @property({
    type: 'string',
  })
  Error: string;

  @property({
    type: 'date',
    default: 'now',
  })
  StartedAt: Date;

  @property({
    type: 'date',
    default: 'now',
  })
  FinishedAt: Date;

  constructor(data?: Partial<ContainerState>) {
    super(data);
  }
}

export interface ContainerStateRelations {
  // describe navigational properties here
}

export type ContainerStateWithRelations = ContainerState & ContainerStateRelations;
