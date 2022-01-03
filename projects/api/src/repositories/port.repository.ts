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

  createIfNotExist = async (port: number) => {
    const isReserved = await this.isReservedPort(port);
    if (isReserved) {
      throw new Error('Port number ' + port + ' is already reserved.');
    }
    return await this.create({
      number: port,
    });
  }

  getFreeNonReservedPort = async (): Promise<number> => {
    const port = await this.getFreePort();
    if (await this.isReservedPort(port)) {
      return this.getFreeNonReservedPort();
    }
    return port;
  }

  getFreePort = () => {
    return net.getFreePort();
  }
}
