import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors, param, post, Request, requestBody, RestBindings} from '@loopback/rest';
import {DockerServiceBindings, GithubServiceBindings, ProjectServiceBindings} from '../keys';
import {ClusterRepository, ContainerRepository, GitBranchRepository, ProjectRepository} from '../repositories';
import {DockerService} from '../services/docker-service';
import {GithubService} from '../services/github-service';
import ProjectService from '../services/project-service';

export class WebhooksController {
  constructor(
    @inject(GithubServiceBindings.GITHUB_SERVICE)
    protected githubService: GithubService,
    @inject(DockerServiceBindings.DOCKER_SERVICE)
    protected dockerService: DockerService,
    @inject(ProjectServiceBindings.PROJECT_SERVICE)
    protected projectService: ProjectService,
    @repository(ClusterRepository)
    protected clusterRepository: ClusterRepository,
    @repository(ProjectRepository)
    protected projectRepository: ProjectRepository,
    @repository(ContainerRepository)
    protected containerRepository: ContainerRepository,
    @repository(GitBranchRepository)
    protected gitBranchRepository: GitBranchRepository,
  ) { }

  @post('/webhooks/github/{projectName}', {
    description: 'Route for handle github webhooks by project',
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
  async githubWebhook(
    @inject(RestBindings.Http.REQUEST)
    req: Request,
    @param.path.string('projectName') projectName: string,
    @requestBody() payload: Record<string, any>,
  ) {
    const {headers} = req;
    const project = await this.projectRepository.findOne({
      where: {
        name: projectName,
      },
      include: [{
        relation: 'clusters',
        scope: {
          include: ['gitBranch', {
            relation: 'production',
          }],
        },
      }],
    });
    if (!project) throw new HttpErrors.NotAcceptable();
    await this.githubService.validateProjectHookReq(project, req, payload);
    const githubEvent = headers['x-github-event'];
    // Ping pong //
    if (githubEvent === 'ping') return 'pong';
    // Create branch //
    if (githubEvent === 'create' && payload.ref_type === 'branch') {
      await this.githubService.addBranch(project, payload.ref);
    }
    // Delete branch
    if (githubEvent === 'delete' && payload.ref_type === 'branch') {
      const gitBranch = await this.gitBranchRepository.findOne({
        where: {
          namespace: `${project.name}.${payload.ref}`,
        },
      });
      if (!gitBranch) return; // Already deleted ?
      await this.gitBranchRepository.deleteById(gitBranch.id);
    }
    // Open pull request //
    if (githubEvent === 'pull_request' && payload.action === 'opened') {
      const fromBranch = payload.pull_request.head.ref;
      Promise.all<void>(project.clusters.map(async (cluster) => {
        if (cluster.gitBranch) return;
        await this.projectService.deployCluster(cluster, {
          branchName: fromBranch,
          isProduction: false,
          isGeneratedDeploy: true,
          lastCommit: payload.pull_request.head.sha,
        });
      })).catch((err) => {
        console.error('Error while deployed new pull request ', payload, err);
      });
    }
    // Close pull request
    if (githubEvent === 'pull_request' && payload.action === 'closed') {
      const fromBranch = payload.pull_request.head.ref;
      const containers = await this.containerRepository.find({
        where: {
          gitBranchName: fromBranch,
        },
      });
      Promise.all(containers.map((container) => {
        return this.dockerService.clusterContainerRemove(container);
      })).catch((err) => {
        console.error('Error while closing pull request ', err);
      });
    }
    // Merge or push in branch //
    if (githubEvent === 'push') {
      const branchName = payload.ref.replace('refs/heads/', '');
      const lastCommit = payload.after;
      if (!branchName.length) throw new HttpErrors.NotAcceptable();
      const branch = await this.gitBranchRepository.findOne({
        where: {
          name: branchName,
        },
      });
      if (!branch) throw new HttpErrors.NotAcceptable();
      await this.gitBranchRepository.updateById(branch.id, {lastCommitSHA: lastCommit});
      const clusters = project.clusters.filter(({gitBranch}) => gitBranch?.name === branchName);
      // Deploy to cluster linked to branch //
      if (clusters.length) {
        this.projectService.deployClusters(clusters, {
          branchName,
          lastCommit,
        }).catch((err) => {
          console.error('Webhook updateCluster error !! ', err);
        });
      } else {
        // Deploy on cluster if no cluster is linked to a branch //
        const clusters = project.clusters.filter(({gitBranch}) => !gitBranch);
        this.projectService.deployClusters(clusters, {
          branchName,
          lastCommit,
        }).catch((err) => {
          console.error('Webhook updateCluster error !! ', err);
        });
      }
    }
    return "Ok";
  }
}
