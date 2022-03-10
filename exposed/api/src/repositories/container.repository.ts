import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, HasManyRepositoryFactory, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Cluster, Container, ContainerOutput, ContainerRelations, ContainerStat, ContainerState, PipelineStatus} from '../models';
import {ClusterRepository} from './cluster.repository';
import {ContainerOutputRepository} from './container-output.repository';
import {ContainerStatRepository} from './container-stat.repository';
import {ContainerStateRepository} from './container-state.repository';
import {PipelineStatusRepository} from './pipeline-status.repository';

export class ContainerRepository extends DefaultCrudRepository<
  Container,
  typeof Container.prototype.id,
  ContainerRelations
> {

  public readonly outputs: HasManyRepositoryFactory<ContainerOutput, typeof Container.prototype.id>;

  public readonly cluster: BelongsToAccessor<Cluster, typeof Container.prototype.id>;

  public readonly pipelineStatus: HasOneRepositoryFactory<PipelineStatus, typeof Container.prototype.id>;

  public readonly state: HasOneRepositoryFactory<ContainerState, typeof Container.prototype.id>;

  public readonly stat: HasOneRepositoryFactory<ContainerStat, typeof Container.prototype.id>;

  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
    @repository.getter('ClusterRepository') protected clusterRepositoryGetter: Getter<ClusterRepository>,
    @repository.getter('ContainerOutputRepository') protected containerOutputRepositoryGetter: Getter<ContainerOutputRepository>,
    @repository.getter('PipelineStatusRepository') protected PipelineStatusRepositoryGetter: Getter<PipelineStatusRepository>,
    @repository.getter('ContainerStateRepository') protected ContainerStateRepositoryGetter: Getter<ContainerStateRepository>, @repository.getter('ContainerStatRepository') protected containerStatRepositoryGetter: Getter<ContainerStatRepository>,
  ) {
    super(Container, dataSource);
    this.stat = this.createHasOneRepositoryFactoryFor('stat', containerStatRepositoryGetter);
    this.registerInclusionResolver('stat', this.stat.inclusionResolver);
    this.state = this.createHasOneRepositoryFactoryFor('state', ContainerStateRepositoryGetter);
    this.registerInclusionResolver('state', this.state.inclusionResolver);
    this.pipelineStatus = this.createHasOneRepositoryFactoryFor('pipelineStatus', PipelineStatusRepositoryGetter);
    this.registerInclusionResolver('pipelineStatus', this.pipelineStatus.inclusionResolver);
    this.cluster = this.createBelongsToAccessorFor('cluster', clusterRepositoryGetter,);
    this.registerInclusionResolver('cluster', this.cluster.inclusionResolver);
    this.outputs = this.createHasManyRepositoryFactoryFor('outputs', containerOutputRepositoryGetter,);
    this.registerInclusionResolver('outputs', this.outputs.inclusionResolver);
  }
}
