import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Port, PortRelations} from '../models';

export class PortRepository extends DefaultCrudRepository<
  Port,
  typeof Port.prototype.id,
  PortRelations
> {
  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
  ) {
    super(Port, dataSource);
  }
}
