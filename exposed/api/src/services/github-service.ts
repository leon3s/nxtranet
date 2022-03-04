import {repository} from '@loopback/repository';
import {HttpErrors, Request} from '@loopback/rest';
import type {AxiosInstance} from 'axios';
import axios from 'axios';
import crypto from 'crypto';
import {Project} from '../models';
import {GitBranchRepository} from '../repositories';

export class GithubService {
  request: AxiosInstance
  constructor(
    @repository(GitBranchRepository)
    protected githubBranchRepository: GitBranchRepository,
  ) {
    this.request = axios.create({
      baseURL: 'https://api.github.com',
    });
  }

  addBranch = async (project: Project, branchName: string) => {
    const auth = {
      username: project.github_username,
      password: project.github_password,
    };
    const res = await this.request.get<{name: string, commit: {sha: string}}>(
      `/repos/${auth.username}/${project.github_project}/branches/${branchName}`, {
      auth,
    });
    return this.githubBranchRepository.create({
      name: res.data.name,
      projectName: project.name,
      lastCommitSHA: res.data.commit.sha,
      namespace: `${project.name}.${branchName}`,
    });
  }

  getProjectBranch = async (opts: {username: string, password: string, projectName: string}) => {
    const {username, password, projectName} = opts;
    const {data: branches} = await this.request.get<{name: string, commit: {sha: string}}[]>(
      `/repos/${username}/${projectName}/branches`, {
      auth: {
        username,
        password,
      },
    });
    return branches;
  }

  syncProjectBranch = async (
    project: Project,
  ): Promise<void> => {
    const branches = await this.getProjectBranch({
      projectName: project.github_project,
      username: project.github_username,
      password: project.github_password,
    });
    await Promise.all(branches.map(async ({name, commit}) => {
      const item = await this.githubBranchRepository.findOne({
        where: {
          name,
          projectName: project.name,
        },
      });
      if (!item) {
        await this.githubBranchRepository.create({
          projectName: project.name,
          namespace: `${project.name}.${name}`,
          name: name,
          lastCommitSHA: commit.sha,
        });
      } else {
        await this.githubBranchRepository.updateById(item.id, {
          lastCommitSHA: commit.sha,
        });
      }
    }));
  }

  validateProjectHookReq = async (project: Project, req: Request, payload: Record<string, any>) => {
    const {headers} = req;
    const userAgent = headers['user-agent'];
    const reqPSha = headers['x-hub-signature-256'];
    const sPayload = JSON.stringify(payload || {});
    const calculedSha = `sha256=${crypto.createHmac('sha256', project.github_webhook_secret).update(sPayload).digest("hex")}`;
    if (!userAgent || !userAgent.includes('GitHub-Hookshot/')) {
      throw new HttpErrors.NotAcceptable('User agent not matching.');
    }
    if (reqPSha !== calculedSha) {
      throw new HttpErrors.NotAcceptable('SHA not matching.');
    }
  }
}
