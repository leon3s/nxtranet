import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors, param, post, Request, requestBody, RestBindings} from '@loopback/rest';
import axios from 'axios';
import crypto from 'crypto';
import { GithubService } from '../services/github-service';
import {DockerServiceBindings, GithubServiceBindings} from '../keys';
import {ContainerRepository, GitBranchRepository, ProjectRepository} from '../repositories';
import {DockerService} from '../services/docker-service';
import { Container, Cluster } from '../models';

export class WebhooksController {
  constructor(
    @inject(GithubServiceBindings.GITHUB_SERVICE)
    protected githubService: GithubService,
    @inject(DockerServiceBindings.DOCKER_SERVICE)
    protected dockerService: DockerService,
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
  async getLatestRelease(
    @inject(RestBindings.Http.REQUEST)
    req: Request,
    @param.path.string('projectName') projectName: string,
    @requestBody() payload: Record<string, any>,
  ) {
    const project = await this.projectRepository.findOne({
      where: {
        name: projectName,
      },
      include: [{
        relation: 'clusters',
        scope: {
          include: ['gitBranch'],
        }
      }],
    });
    if (!project) throw new HttpErrors.NotAcceptable();
    const userAgent = req.headers['user-agent'];
    const githubEvent = req.headers['x-github-event'];
    const reqPSha = req.headers['x-hub-signature-256'];
    const sPayload = JSON.stringify(payload || {});
    const validatePayload = (payload: string) =>
      `sha256=${crypto.createHmac('sha256', project.github_webhook_secret).update(payload).digest("hex")}`;

    const calculedSha = validatePayload(sPayload);

    if (!userAgent || !userAgent.includes('GitHub-Hookshot/')) {
      if (!project) throw new HttpErrors.NotAcceptable();
    }
    if (reqPSha !== calculedSha) {
      throw new HttpErrors.NotAcceptable();
    }
    if (githubEvent === 'ping') return 'pong';
    if (githubEvent === 'create' && payload.ref_type === 'branch') {
      await this.githubService.addBranch(project, payload.ref);
    }
    if (githubEvent === 'delete' && payload.ref_type === 'branch') {
      const gitBranch = await this.gitBranchRepository.findOne({
        where: {
          namespace: `${project.name}.${payload.ref}`,
        },
      });
      if (!gitBranch) return; // Already deleted ?
      await this.gitBranchRepository.deleteById(gitBranch.id);
    }
    if (githubEvent === 'pull_request' && payload.action === 'opened') {
      const fromBranch = payload.pull_request.head.ref;
      await Promise.all<void>(project.clusters.map(async (cluster) => {
        if (cluster.gitBranch) return;
        await this.dockerService.clusterDeploy(cluster.namespace, fromBranch);
      }));
    }
    if (githubEvent === 'pull_request' && payload.action === 'closed') {
      const fromBranch = payload.pull_request.head.ref;
      const containers = await this.containerRepository.find({
        where: {
          gitBranchName: fromBranch,
        },
      });
      setTimeout(async () => {
        await Promise.all(containers.map((container) => {
          return this.dockerService.clusterContainerRemove(
            container.clusterNamespace,
            container.name,
          );
        }));
      }, 500);
    }
    if (githubEvent === 'push') {
      const branchName = payload.ref.replace('refs/heads/', '');
      const lastCommit = payload.after;
      if (!branchName.length) throw new HttpErrors.NotAcceptable();
      const updateCluster = async (cluster: Cluster) => {
        const container = await this.dockerService.clusterDeploy(cluster.namespace, branchName);
        await this.containerRepository.updateById(container.id, {
          commitSHA: lastCommit,
        });
        this.dockerService.whenContainerReady(container).then(async () => {
          const containers = await this.containerRepository.find({
            where: {
              commitSHA: {
                nin: [lastCommit],
              },
              gitBranchName: branchName,
            },
          });
          console.log('Container to delete', containers);
          await Promise.all(containers.map((container) => {
            return this.dockerService.clusterContainerRemove(container.clusterNamespace, container.name);
          }));
        }).catch((err) => {
          console.error('Webhook github update cluster error ', {err});
        });
      }
      const branch = await this.gitBranchRepository.findOne({
        where: {
          name: branchName,
        },
      });
      if (!branch) throw new HttpErrors.NotAcceptable();
      await this.gitBranchRepository.updateById(branch.id, { lastCommitSHA: lastCommit });
      const cluster = project.clusters.find(({gitBranch}) => gitBranch?.name === branchName);
      if (cluster) {
        updateCluster(cluster).catch((err) => {
          console.error('Webhook updateCluster error !! ', err);
        });
      } else {
        const clusters = project.clusters.filter(({gitBranch}) => !gitBranch);
        Promise.all(clusters.map((cluster) => {
          return updateCluster(cluster);
        })).catch((err) => {
          console.error('Webhook updateCluster error !! ', err);
        });
      }
    }
    return "Ok";
  }
}
