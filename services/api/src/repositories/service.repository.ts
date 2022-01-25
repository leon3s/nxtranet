import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Service, ServiceRelations, Port, PortMapping} from '../models';
import {PortRepository} from './port.repository';
import {PortMappingRepository} from './port-mapping.repository';

export class ServiceRepository extends DefaultCrudRepository<
  Service,
  typeof Service.prototype.id,
  ServiceRelations
> {

  public readonly port: BelongsToAccessor<Port, typeof Service.prototype.id>;

  public readonly ports: HasManyThroughRepositoryFactory<Port, typeof Port.prototype.id,
          PortMapping,
          typeof Service.prototype.id
        >;

  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource, @repository.getter('PortRepository') protected portRepositoryGetter: Getter<PortRepository>, @repository.getter('PortMappingRepository') protected portMappingRepositoryGetter: Getter<PortMappingRepository>,
  ) {
    super(Service, dataSource);
    this.ports = this.createHasManyThroughRepositoryFactoryFor('ports', portRepositoryGetter, portMappingRepositoryGetter,);
    this.registerInclusionResolver('ports', this.ports.inclusionResolver);
    this.port = this.createBelongsToAccessorFor('port', portRepositoryGetter,);
    this.registerInclusionResolver('port', this.port.inclusionResolver);
  }
}
