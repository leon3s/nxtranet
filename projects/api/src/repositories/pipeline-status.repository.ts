import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Pipeline, PipelineStatus, PipelineStatusRelations} from '../models';
import {PipelineRepository} from './pipeline.repository';

export class PipelineStatusRepository extends DefaultCrudRepository<
  PipelineStatus,
  typeof PipelineStatus.prototype.id,
  PipelineStatusRelations
> {

  public readonly pipeline: BelongsToAccessor<Pipeline, typeof PipelineStatus.prototype.id>;

  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource, @repository.getter('PipelineRepository') protected pipelineRepositoryGetter: Getter<PipelineRepository>,
  ) {
    super(PipelineStatus, dataSource);
    this.pipeline = this.createBelongsToAccessorFor('pipeline', pipelineRepositoryGetter,);
    this.registerInclusionResolver('pipeline', this.pipeline.inclusionResolver);
  }

  async createOrUpdate(pipelineStatus: Partial<PipelineStatus>): Promise<PipelineStatus> {
    const pipelineStatusDb = await this.findOne({
      where: {
        pipelineNamespace: pipelineStatus.pipelineNamespace,
        containerNamespace: pipelineStatus.containerNamespace,
      }
    });
    if (!pipelineStatusDb) {
      return this.create(pipelineStatus);
    }
    await this.updateById(pipelineStatusDb.id, pipelineStatus);
    return this.findById(pipelineStatusDb.id);
  }
}
