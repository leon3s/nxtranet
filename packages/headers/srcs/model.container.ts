import type {ModelCluster} from './model.cluster';
import type {ModelContainerOutput} from './model.containerOutput';
import type {ModelContainerState} from './model.containerState';
import type {ModelPipelineStatus} from './model.pipelineStatus';

export type ModelContainer = {
  id: string;
  namespace: string;
  creationDate?: Date;
  dockerID: string;
  appPort: number;
  deployerPort: number;
  projectName: string;
  name: string;
  gitBranchName: string;
  commitSHA: string;
  isProduction?: boolean;
  isGeneratedDeploy?: boolean;
  outputs: ModelContainerOutput[];
  clusterNamespace: string;
  cluster?: ModelCluster;
  pipelineStatus: ModelPipelineStatus;
  state: ModelContainerState;
};
