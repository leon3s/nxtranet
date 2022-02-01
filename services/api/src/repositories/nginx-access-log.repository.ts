import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {NginxAccessLog, NginxAccessLogRelations} from '../models';

export class NginxAccessLogRepository extends DefaultCrudRepository<
  NginxAccessLog,
  typeof NginxAccessLog.prototype.id,
  NginxAccessLogRelations
> {
  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
  ) {
    super(NginxAccessLog, dataSource);
  }
}
