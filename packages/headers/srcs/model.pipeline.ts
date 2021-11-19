import { ModelPipelineCmd } from "./model.pipelineCmd";

export type ModelPipeline = {
  projectName: string;
  namespace:	string;
  color:	string;
  name:	string;
  id: string;
  commands: ModelPipelineCmd[];
}
