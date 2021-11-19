import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {PipelineCmd, PipelineCmdRelations} from '../models';

export class PipelineCmdRepository extends DefaultCrudRepository<
  PipelineCmd,
  typeof PipelineCmd.prototype.id,
  PipelineCmdRelations
> {
  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
  ) {
    super(PipelineCmd, dataSource);
  }
}
