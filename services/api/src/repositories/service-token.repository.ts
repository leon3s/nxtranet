import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {ServiceToken, ServiceTokenRelations} from '../models';

export class ServiceTokenRepository extends DefaultCrudRepository<
  ServiceToken,
  typeof ServiceToken.prototype.id,
  ServiceTokenRelations
> {
  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
  ) {
    super(ServiceToken, dataSource);
  }
}
