import {
  belongsTo, Entity, hasMany, hasOne, model,
  property
} from '@loopback/repository';
import {Cluster} from './cluster.model';
import {ContainerOutput} from './container-output.model';
import {ContainerStat} from './container-stat.model';
import {ContainerState} from './container-state.model';
import {PipelineStatus} from './pipeline-status.model';

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
export class Container extends Entity {
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
  namespace: string;

  @property({
    type: 'Date',
    defaultFn: 'now',
  })
  creationDate?: Date;

  @property({
    type: 'string',
  })
  dockerID: string;

  @property({
    type: 'number'
  })
  appPort: number;

  @property({
    type: 'number',
  })
  deployerPort: number;

  @property({
    type: 'string'
  })
  projectName: string;

  @property({
    type: 'string',
  })
  name: string;

  @property({
    type: 'string',
  })
  gitBranchName: string;

  @property({
    type: 'string'
  })
  commitSHA: string;

  @property({
    type: 'boolean',
    default: false,
  })
  isProduction?: boolean;

  @property({
    type: 'boolean',
    default: false,
  })
  isGeneratedDeploy?: boolean;

  @hasMany(() => ContainerOutput, {
    keyFrom: 'namespace',
    keyTo: 'containerNamespace',
  })
  outputs: ContainerOutput[];

  @belongsTo(() => Cluster, {
    name: 'cluster',
    keyTo: 'namespace',
    keyFrom: 'clusterNamespace',
  })
  clusterNamespace: string;

  cluster?: Cluster;

  @hasOne(() => PipelineStatus, {
    keyFrom: 'namespace',
    keyTo: 'containerNamespace',
    name: 'pipelineStatus',
  })
  pipelineStatus: PipelineStatus;

  @hasOne(() => ContainerState, {
    keyFrom: 'namespace',
    keyTo: 'containerNamespace',
    name: 'state'
  })
  state: ContainerState;

  @hasOne(() => ContainerStat, {
    keyFrom: 'dockerID',
    keyTo: 'dockerID',
  })
  stat: ContainerStat;

  constructor(data?: Partial<Container>) {
    super(data);
  }
}

export interface ContainerRelations {
  // describe navigational properties here
}

export type ContainerWithRelations = Container & ContainerRelations;
