import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {GitBranch, GitBranchRelations} from '../models';

export class GitBranchRepository extends DefaultCrudRepository<
  GitBranch,
  typeof GitBranch.prototype.id,
  GitBranchRelations
> {
  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
  ) {
    super(GitBranch, dataSource);
  }
}
