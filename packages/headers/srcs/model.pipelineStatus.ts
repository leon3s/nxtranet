import type {ModelContainer} from './model.container';
import type {ModelPipeline} from "./model.pipeline";

export enum PipelineStatusEnum {
  STARTING = 'starting',
  PASSED = 'passed',
  FAILED = 'failed',
  ONLINE = 'online',
}

export type ModelPipelineStatus = {
  id: string;
  creationDate?: Date;
  value: PipelineStatusEnum;
  error?: string;
  pipelineNamespace: string;
  pipeline?: ModelPipeline;
  containerNamespace: string;
  container?: ModelContainer;
}
