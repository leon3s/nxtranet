import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {ClusterProduction, ClusterProductionRelations} from '../models';

export class ClusterProductionRepository extends DefaultCrudRepository<
  ClusterProduction,
  typeof ClusterProduction.prototype.id,
  ClusterProductionRelations
> {

  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
  ) {
    super(ClusterProduction, dataSource);
  }
}
