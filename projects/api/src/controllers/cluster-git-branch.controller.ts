import {
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param
} from '@loopback/rest';
import {
  Cluster,
  GitBranch
} from '../models';
import {ClusterRepository} from '../repositories';

export class ClusterGitBranchController {
  constructor(
    @repository(ClusterRepository)
    public clusterRepository: ClusterRepository,
  ) { }

  @get('/clusters/{namespace}/git-branch', {
    responses: {
      '200': {
        description: 'GitBranch belonging to Cluster',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(GitBranch)},
          },
        },
      },
    },
  })
  async getGitBranch(
    @param.path.string('namespace') namespace: typeof Cluster.prototype.namespace,
  ): Promise<GitBranch> {
    return this.clusterRepository.gitBranch(namespace);
  }
}
