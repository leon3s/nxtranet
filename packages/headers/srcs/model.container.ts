import type { ModelCluster } from './model.cluster';
import type { ModelPipelineStatus } from './model.pipelineStatus';
import type { ModelContainerOutput } from './model.containerOutput';

export type         ModelContainer = {
  id:               string;
  name:             string;
  appPort:          number;
  dockerID:         string;
  namespace:        string;
  deployerPort:     number;
  clusterNamespace: string;
  gitBranchName:    string;
  commitSHA:        string;
  cluster:          ModelCluster;
  pipelineStatus:   ModelPipelineStatus;
  outputs:          ModelContainerOutput[];
};
