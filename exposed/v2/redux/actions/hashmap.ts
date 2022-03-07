export {
  createPipelineCmd,
  createProject,
  createProjectCluster,
  createProjectPipeline, deletePipelineCmd, deleteProjectByName
} from './project';

export type ActionKeys = "createProject" | "deleteProjectByName" |
  "createProjectCluster" | "createProjectPipeline" | "createPipelineCmd" |
  "deletePipelineCmd";
