import {ModelPipelineCmd} from "./model.pipelineCmd";

export type ModelPipeline = {
  id: string;
  creationDate?: Date;
  projectName: string;
  namespace: string;
  color: string;
  name: string;
  commands?: ModelPipelineCmd[];
}
