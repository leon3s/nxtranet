import type {ModelContainer} from './model.container';
import type {ModelEnvVar} from './model.envVar';
import type {ModelGitbranch} from './model.gitBranch';
import {ModelPipeline} from './model.pipeline';
import type {ModelProject} from './model.project';

export enum ModelClusterType {
  TESTING = 'TESTING',
  SINGLE = 'DEPLOYING',
  SCALING = 'SCALING',
}

export type ModelCluster = {
  id: string;
  creationDate: Date | string;
  namespace: string;
  projectName: string;
  type: ModelClusterType;
  project?: ModelProject;
  containers: ModelContainer[];
  name: string;
  envVars: ModelEnvVar[];
  gitBranchNamespace: string;
  gitBranch?: ModelGitbranch;
  host: string;
  hostname: string;
  pipelines: ModelPipeline[];
};
