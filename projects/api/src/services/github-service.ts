import {repository} from '@loopback/repository';
import type {AxiosInstance} from 'axios';
import axios from 'axios';
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

  addBranch = async (project:Project, branchName: string) => {
    const auth = {
      username: project.github_username,
      password: project.github_password,
    };
    const res = await this.request.get<{name: string, commit: {sha: string}}>(
      `/repos/${auth.username}/${project.name}/branches/${branchName}`, {
      auth,
    });
    return this.githubBranchRepository.create({
      name: res.data.name,
      projectName: project.name,
      lastCommitSHA: res.data.commit.sha,
      namespace: `${project.name}.${branchName}`,
    });
  }

  syncProjectBranch = async (
    project: Project,
  ): Promise<void> => {
    const auth = {
      username: project.github_username,
      password: project.github_password,
    }
    const {data: branches} = await this.request.get<{name: string, commit: {sha: string}}[]>(
      `/repos/${auth.username}/${project.name}/branches`, {
      auth,
    });
    await Promise.all(branches.map(async ({name, commit}) => {
      const item = await this.githubBranchRepository.findOne({
        where: { name },
      });
      if (!item) {
        return this.githubBranchRepository.create({
          projectName: project.name,
          namespace: `${project.name}.${name}`,
          name: name,
          lastCommitSHA: commit.sha,
        });
      }
      item.lastCommitSHA = commit.sha;
      this.githubBranchRepository.updateById(item.id, {
        lastCommitSHA: item.lastCommitSHA,
      });
      return item;
    }));
  }
}
