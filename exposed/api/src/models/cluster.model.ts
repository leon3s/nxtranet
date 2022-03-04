import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {ModelClusterType} from '@nxtranet/headers';
import {ClusterPipeline} from './cluster-pipeline.model';
import {Container} from './container.model';
import {GitBranch} from './git-branch.model';
import {Pipeline} from './pipeline.model';
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
  name: string;

  @property({
    type: 'string',
  })
  hostname: string;

  @property({
    type: 'string',
    default: '127.0.0.1',
  })
  host: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(ModelClusterType),
    },
  })
  type: ModelClusterType;

  @property({
    type: 'string',
    required: true,
  })
  namespace: string;

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

  @hasMany(() => Pipeline, {through: {model: () => ClusterPipeline, keyFrom: 'clusterId', keyTo: 'pipelineId'}})
  pipelines: Pipeline[];

  constructor(data?: Partial<Cluster>) {
    super(data);
  }
}

export interface ClusterRelations {
  // describe navigational properties here
}

export type ClusterWithRelations = Cluster & ClusterRelations;
