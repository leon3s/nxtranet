import {Entity, model, property} from '@loopback/repository';

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
export class GitBranch extends Entity {
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
  name: string;

  @property({
    type: 'string',
    required: true
  })
  namespace: string;

  @property({
    type: 'string',
    required: true,
  })
  projectName: string;

  @property({
    type: 'string',
    required: true,
  })
  lastCommitSHA: string;

  constructor(data?: Partial<GitBranch>) {
    super(data);
  }
}

export interface GitBranchRelations {
  // describe navigational properties here
}

export type GitBranchWithRelations = GitBranch & GitBranchRelations;
