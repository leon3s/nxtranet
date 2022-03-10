import type {ModelCluster} from './model.cluster';
import type {ModelGitbranch} from './model.gitBranch';
import type {ModelPipeline} from "./model.pipeline";

export type ModelProject = {
  id: string;
  creationDate: Date | string;
  name: string;
  github_project: string;
  github_username: string;
  github_password: string;
  github_webhook: string;
  github_webhook_secret: string;
  pipelines: ModelPipeline[];
  clusters: ModelCluster[];
  gitBranches: ModelGitbranch[];
}
