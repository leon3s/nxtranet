import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {UserCredential, UserCredentialRelations} from '../models';

export class UserCredentialRepository extends DefaultCrudRepository<
  UserCredential,
  typeof UserCredential.prototype.id,
  UserCredentialRelations
> {
  constructor(@inject('datasources.mongoDB') dataSource: MongoDbDataSource) {
    super(UserCredential, dataSource);
  }
}
