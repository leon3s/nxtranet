export {
  clusterDeploy, createPipelineCmd,
  createProject,
  createProjectCluster, createProjectPipeline, deleteClusterContainer, deleteClusterPipelineLink, deletePipelineCmd, deleteProjectByName
} from './project';

export type ActionKeys = "createProject" | "deleteProjectByName" |
  "createProjectCluster" | "createProjectPipeline" | "createPipelineCmd" |
  "deletePipelineCmd" | "deleteClusterPipelineLink" | "clusterDeploy"
  | "deleteClusterContainer";

