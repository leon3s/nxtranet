import {inject} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {
  getModelSchemaRef,
  HttpErrors,
  param, post,
  requestBody
} from '@loopback/rest';
import {DnsmasqServiceBindings, ProjectServiceBindings} from '../keys';
import {Cluster, Container} from '../models';
import {ClusterRepository, GitBranchRepository} from '../repositories';
import {DnsmasqService} from '../services/dnsmasq-service';
import ProjectService from '../services/project-service';

export class ClusterController {
  constructor(
    @inject(DnsmasqServiceBindings.DNSMASQ_SERVICE)
    protected dnsmasqService: DnsmasqService,
    @inject(ProjectServiceBindings.PROJECT_SERVICE)
    protected projectService: ProjectService,
    @repository(ClusterRepository)
    protected clusterRepository: ClusterRepository,
    @repository(GitBranchRepository)
    protected gitBranchRepository: GitBranchRepository,
  ) { }

  @post('/clusters/{namespace}/deploy', {
    responses: {
      '200': {
        description: '"Ok" if success',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Container)},
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
  ): Promise<Container[]> {
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
    const containers = await this.projectService.deployCluster(cluster, {
      lastCommit: gitBranch.lastCommitSHA,
      branchName: gitBranch.name,
      isGeneratedDeploy: false,
      isProduction: false,
    });
    await this.dnsmasqService.configSync();
    await this.dnsmasqService.restartService();
    return containers;
  }
}
