import {belongsTo, Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import {ClusterProduction} from './cluster-production.model';
import {Container} from './container.model';
import {GitBranch} from './git-branch.model';
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
  creationDate: Date;

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

  @hasOne(() => ClusterProduction, {
    keyFrom: 'namespace',
    keyTo: 'clusterNamespace'
  })
  production: ClusterProduction;

  constructor(data?: Partial<Cluster>) {
    super(data);
  }
}

export interface ClusterRelations {
  // describe navigational properties here
}

export type ClusterWithRelations = Cluster & ClusterRelations;
