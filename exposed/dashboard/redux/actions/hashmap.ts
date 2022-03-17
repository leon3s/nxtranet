export {
  clusterDeploy,
  createPipelineCmd,
  createProject,
  createProjectCluster,
  createProjectPipeline,
  deleteClusterContainer,
  deleteClusterPipelineLink,
  deletePipelineCmd,
  deleteProjectByName,
  createClusterEnvVar,
  deleteClusterEnvVar,
  deleteProjectCluster
} from './project';

export type ActionKeys = "createProject" | "deleteProjectByName"
  | "createProjectCluster" | "createProjectPipeline" | "createPipelineCmd"
  | "deletePipelineCmd" | "deleteClusterPipelineLink" | "clusterDeploy"
  | "deleteClusterContainer" | "deleteProjectCluster"
  | "createClusterEnvVar" | "deleteClusterEnvVar";
