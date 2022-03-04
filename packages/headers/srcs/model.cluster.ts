import type {ModelContainer} from './model.container';
import type {ModelEnvVar} from './model.envVar';
import type {ModelGitbranche} from './model.gitBranche';
import {ModelPipeline} from './model.pipeline';
import type {ModelProject} from './model.project';

export enum ModelClusterType {
  TESTING = 'TESTING',
  SINGLE = 'SINGLE',
  SCALING = 'SCALING',
}

export type ModelCluster = {
  id: string;
  creationDate: Date;
  namespace: string;
  projectName: string;
  project?: ModelProject;
  containers: ModelContainer[];
  name: string;
  envVars: ModelEnvVar[];
  gitBranchNamespace: string;
  gitBranch?: ModelGitbranche;
  host: string;
  hostname: string;
  pipelines: ModelPipeline[];
};
