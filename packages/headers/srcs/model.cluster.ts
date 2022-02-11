import type {ModelClusterProduction} from './model.clusterProduction';
import type {ModelContainer} from './model.container';
import type {ModelEnvVar} from './model.envVar';
import type {ModelGitbranche} from './model.gitBranche';
import type {ModelProject} from './model.project';

export type ModelCluster = {
  id: string;
  creationDate: Date;
  namespace: string;
  isProduction?: boolean;
  projectName: string;
  project?: ModelProject;
  containers: ModelContainer[];
  name: string;
  envVars: ModelEnvVar[];
  gitBranchNamespace: string;
  gitBranch?: ModelGitbranche;
  production: ModelClusterProduction;
};
