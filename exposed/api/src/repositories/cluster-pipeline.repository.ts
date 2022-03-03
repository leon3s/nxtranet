import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {ClusterPipeline, ClusterPipelineRelations} from '../models';

export class ClusterPipelineRepository extends DefaultCrudRepository<
  ClusterPipeline,
  typeof ClusterPipeline.prototype.id,
  ClusterPipelineRelations
> {
  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
  ) {
    super(ClusterPipeline, dataSource);
  }
}
