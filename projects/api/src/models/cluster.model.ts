import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {Container} from './container.model';
import {GitBranch} from './git-branch.model';
import {Port} from './port.model';
import {Project} from './project.model';
import {EnvVar} from './var-env.model';

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
export class Cluster extends Entity {
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
    type: 'boolean',
    required: false,
    default: false,
  })
  isProduction?: boolean;

  @property({
    type: 'number',
    required: false,
    default: 0,
  })
  numberOfInstance?: number;

  @belongsTo(() => Project, {
    name: 'project',
    keyFrom: 'projectName',
    keyTo: 'name',
  })
  projectName: string;

  project?: Project;

  @hasMany(() => Container, {
    keyTo: 'clusterNamespace',
    keyFrom: 'namespace',
    name: 'containers',
  })
  containers: Container[];

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @hasMany(() => EnvVar, {
    keyFrom: 'namespace',
    keyTo: 'clusterNamespace',
    name: 'envVars',
  })
  envVars: EnvVar[];

  @belongsTo(() => GitBranch, {
    keyFrom: 'gitBranchNamespace',
    keyTo: 'namespace',
    name: 'gitBranch',
  })
  gitBranchNamespace: string;

  gitBranch?: GitBranch;

  @hasMany(() => Port, {
    keyFrom: 'namespace',
    keyTo: 'clusterNamespace',
    name: 'ports',
  })
  ports: Port[];

  constructor(data?: Partial<Cluster>) {
    super(data);
  }
}

export interface ClusterRelations {
  // describe navigational properties here
}

export type ClusterWithRelations = Cluster & ClusterRelations;
