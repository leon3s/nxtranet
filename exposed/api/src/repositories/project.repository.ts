import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository, HasOneRepositoryFactory} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Cluster, GitBranch, Pipeline, Project, ProjectRelations, ClusterProduction} from '../models';
import {ClusterRepository} from './cluster.repository';
import {GitBranchRepository} from './git-branch.repository';
import {PipelineRepository} from './pipeline.repository';
import {ClusterProductionRepository} from './cluster-production.repository';

export class ProjectRepository extends DefaultCrudRepository<
  Project,
  typeof Project.prototype.id,
  ProjectRelations
> {

  public readonly clusters: HasManyRepositoryFactory<Cluster, typeof Cluster.prototype.id>;

  public readonly pipelines: HasManyRepositoryFactory<Pipeline, typeof Project.prototype.id>;

  public readonly gitBranches: HasManyRepositoryFactory<GitBranch, typeof Project.prototype.id>;

  public readonly clusterProduction: HasOneRepositoryFactory<ClusterProduction, typeof Project.prototype.id>;

  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
    @repository.getter('ClusterRepository') protected clusterRepositoryGetter: Getter<ClusterRepository>, @repository.getter('PipelineRepository') protected pipelineRepositoryGetter: Getter<PipelineRepository>, @repository.getter('GitBranchRepository') protected gitBranchRepositoryGetter: Getter<GitBranchRepository>, @repository.getter('ClusterProductionRepository') protected clusterProductionRepositoryGetter: Getter<ClusterProductionRepository>,
  ) {
    super(Project, dataSource);
    this.clusterProduction = this.createHasOneRepositoryFactoryFor('clusterProduction', clusterProductionRepositoryGetter);
    this.registerInclusionResolver('clusterProduction', this.clusterProduction.inclusionResolver);
    this.gitBranches = this.createHasManyRepositoryFactoryFor('gitBranches', gitBranchRepositoryGetter,);
    this.registerInclusionResolver('gitBranches', this.gitBranches.inclusionResolver);
    this.pipelines = this.createHasManyRepositoryFactoryFor('pipelines', pipelineRepositoryGetter,);
    this.registerInclusionResolver('pipelines', this.pipelines.inclusionResolver);

    this.clusters = this.createHasManyRepositoryFactoryFor('clusters', clusterRepositoryGetter,);
    this.registerInclusionResolver('clusters', this.clusters.inclusionResolver);
  }
}
