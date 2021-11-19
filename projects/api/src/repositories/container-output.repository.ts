import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {ContainerOutput, ContainerOutputRelations} from '../models';

export class ContainerOutputRepository extends DefaultCrudRepository<
  ContainerOutput,
  typeof ContainerOutput.prototype.id,
  ContainerOutputRelations
> {
  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
  ) {
    super(ContainerOutput, dataSource);
  }
}
