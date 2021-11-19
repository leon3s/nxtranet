import {
  Filter,
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param
} from '@loopback/rest';
import {
  GitBranch
} from '../models';
import {ProjectRepository} from '../repositories';

export class ProjectGitBranchController {
  constructor(
    @repository(ProjectRepository) protected projectRepository: ProjectRepository,
  ) { }

  @get('/projects/{name}/git-branches', {
    description: 'Get git branches for a project',
    responses: {
      '200': {
        description: 'Array of Project has many GitBranch',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(GitBranch)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('name') name: string,
    @param.filter(GitBranch) filter?: Filter<GitBranch>,
  ): Promise<GitBranch[]> {
    return this.projectRepository.gitBranches(name).find(filter);
  }
}
