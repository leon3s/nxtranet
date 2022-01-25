import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {PortMapping, PortMappingRelations} from '../models';

export class PortMappingRepository extends DefaultCrudRepository<
  PortMapping,
  typeof PortMapping.prototype.id,
  PortMappingRelations
> {
  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
  ) {
    super(PortMapping, dataSource);
  }
}
