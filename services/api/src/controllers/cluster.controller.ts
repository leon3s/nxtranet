import {inject} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {
  HttpErrors,
  param, post,
  requestBody
} from '@loopback/rest';
import {ProjectServiceBindings} from '../keys';
import {Cluster} from '../models';
import {ClusterRepository, GitBranchRepository} from '../repositories';
import ProjectService from '../services/project-service';

export class ClusterController {
  constructor(
    @inject(ProjectServiceBindings.PROJECT_SERVICE)
    protected projectService: ProjectService,
    @repository(ClusterRepository)
    protected clusterRepository: ClusterRepository,
    @repository(GitBranchRepository)
    protected gitBranchRepository: GitBranchRepository,
  ) { }

  @post('/cluster/{namespace}/deploy', {
    responses: {
      '200': {
        description: '"Ok" if success',
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: 'Ok',
            }
          }
        }
      }
    }
  })
  async create(
    @param.path.string('namespace') namespace: typeof Cluster.prototype.namespace,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            properties: {
              branch: {
                type: "string"
              }
            }
          }
        },
      },
    }) payload: {branch: string},
  ): Promise<"Ok"> {
    const cluster = await this.clusterRepository.findOne({
      where: {
        namespace,
      },
      include: [
        {
          relation: "gitBranch",
        }
      ]
    });
    if (!cluster) throw new HttpErrors.NotFound('Target cluster not found.');
    let gitBranch = cluster.gitBranch || null;
    if (!gitBranch) {
      gitBranch = await this.gitBranchRepository.findOne({
        where: {
          projectName: cluster.projectName,
          name: payload.branch,
        }
      });
      if (!gitBranch) throw new HttpErrors.NotFound('Target git branch not found.');
    }
    await this.projectService.deployCluster(cluster, {
      lastCommit: gitBranch.lastCommitSHA,
      branchName: gitBranch.name,
      isGeneratedDeploy: false,
      isProduction: false,
    });
    return "Ok";
  }
}
