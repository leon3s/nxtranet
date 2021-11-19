import type { ModelPipeline } from "./model.pipeline";

export enum PipelineStatusEnum {
  STARTING = 'starting',
  PASSED = 'passed',
  FAILED = 'failed',
  ONLINE = 'online',
}

export type ModelPipelineStatus = {
  id: string;
  pipeline: ModelPipeline;
  value: PipelineStatusEnum;
  pipelineNamespace: string;
  containerNamespace: string;
}
