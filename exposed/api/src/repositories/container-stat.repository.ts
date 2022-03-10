import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {ContainerStat, ContainerStatRelations} from '../models';

export class ContainerStatRepository extends DefaultCrudRepository<
  ContainerStat,
  typeof ContainerStat.prototype.id,
  ContainerStatRelations
> {
  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
  ) {
    super(ContainerStat, dataSource);
  }
}
