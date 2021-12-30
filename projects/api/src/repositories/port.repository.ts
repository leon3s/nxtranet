import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {net} from '@nxtranet/node';
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

  isReservedPort = async (port: number) => {
    const portDB = await this.findOne({
      where: {
        number: port,
      }
    });
    return portDB;
  }

  getFreePort = () => {
    return net.getFreePort();
  }
}
