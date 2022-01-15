import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {ContainerState, ContainerStateRelations} from '../models';

export class ContainerStateRepository extends DefaultCrudRepository<
  ContainerState,
  typeof ContainerState.prototype.id,
  ContainerStateRelations
> {
  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
  ) {
    super(ContainerState, dataSource);
  }
}
