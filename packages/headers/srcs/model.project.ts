import {ModelClusterProduction} from '.';
import type {ModelCluster} from './model.cluster';
import type {ModelGitbranche} from './model.gitBranche';
import type {ModelPipeline} from "./model.pipeline";

export type ModelProject = {
  id: string;
  creationDate: Date;
  name: string;
  github_project: string;
  github_username: string;
  github_password: string;
  github_webhook: string;
  github_webhook_secret: string;
  domain_name: string;
  pipelines: ModelPipeline[];
  clusters: ModelCluster[];
  gitBranches: ModelGitbranche[];
  clusterProduction: ModelClusterProduction;
}
