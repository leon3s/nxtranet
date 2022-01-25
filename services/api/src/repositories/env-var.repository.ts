import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {EnvVar, EnvVarRelations} from '../models';

export class EnvVarRepository extends DefaultCrudRepository<
  EnvVar,
  typeof EnvVar.prototype.id,
  EnvVarRelations
> {
  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
  ) {
    super(EnvVar, dataSource);
  }
}
