import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {ClusterProduction, ClusterProductionRelations, Port, PortMapping} from '../models';
import {PortMappingRepository} from './port-mapping.repository';
import {PortRepository} from './port.repository';

export class ClusterProductionRepository extends DefaultCrudRepository<
  ClusterProduction,
  typeof ClusterProduction.prototype.id,
  ClusterProductionRelations
> {

  public readonly ports: HasManyThroughRepositoryFactory<Port, typeof Port.prototype.id,
          PortMapping,
          typeof ClusterProduction.prototype.id
        >;

  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource, @repository.getter('PortMappingRepository') protected portMappingRepositoryGetter: Getter<PortMappingRepository>, @repository.getter('PortRepository') protected portRepositoryGetter: Getter<PortRepository>,
  ) {
    super(ClusterProduction, dataSource);
    this.ports = this.createHasManyThroughRepositoryFactoryFor('ports', portRepositoryGetter, portMappingRepositoryGetter,);
    this.registerInclusionResolver('ports', this.ports.inclusionResolver);
  }
}
