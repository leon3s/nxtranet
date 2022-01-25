import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Pipeline, PipelineCmd, PipelineRelations} from '../models';
import {PipelineCmdRepository} from './pipeline-cmd.repository';

export class PipelineRepository extends DefaultCrudRepository<
  Pipeline,
  typeof Pipeline.prototype.id,
  PipelineRelations
> {

  public readonly commands: HasManyRepositoryFactory<PipelineCmd, typeof Pipeline.prototype.id>;

  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
    @repository.getter('PipelineCmdRepository') protected pipelineExeRepositoryGetter: Getter<PipelineCmdRepository>,
  ) {
    super(Pipeline, dataSource);
    this.commands = this.createHasManyRepositoryFactoryFor('commands', pipelineExeRepositoryGetter,);
    this.registerInclusionResolver('commands', this.commands.inclusionResolver);
  }
}
