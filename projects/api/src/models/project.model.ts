import {Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import {ClusterProduction} from './cluster-production.model';
import {Cluster} from './cluster.model';
import {GitBranch} from './git-branch.model';
import {Pipeline} from './pipeline.model';

@model({
  settings: {
    strict: true,
    indexes: {
      uniqueName: {
        keys: {
          name: 1,
        },
        options: {
          unique: true,
        },
      },
    },
  }
})
export class Project extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    mongodb: {
      dataType: 'ObjectID',
    },
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
  name: string;

  @property({
    type: 'string'
  })
  github_project: string;

  @property({
    type: 'string'
  })
  github_username: string;

  @property({
    type: 'string'
  })
  github_password: string;

  @property({
    type: 'string',
  })
  github_webhook: string;

  @property({
    type: 'string'
  })
  github_webhook_secret: string;

  @property({
    type: 'string',
  })
  domain_name: string;

  @hasMany(() => Cluster, {
    keyFrom: 'name',
    keyTo: 'projectName',
    name: 'clusters',
  })
  clusters: Cluster[];

  @hasMany(() => Pipeline, {
    keyTo: 'projectName',
    keyFrom: 'name',
    name: 'pipelines',
  })
  pipelines: Pipeline[];

  @hasMany(() => GitBranch, {
    keyTo: 'projectName',
    keyFrom: 'name',
    name: 'gitBranches',
  })
  gitBranches: GitBranch[];

  @hasOne(() => ClusterProduction, {
    keyFrom: 'name',
    keyTo: 'projectName',
  })
  clusterProduction: ClusterProduction;

  constructor(data?: Partial<Project>) {
    super(data);
  }
}

export interface ProjectRelations {
  // describe navigational properties here
}

export type ProjectWithRelations = Project & ProjectRelations;
