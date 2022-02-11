export type ModelContainerState = {
  id: string;
  containerNamespace?: string;
  Status: 'exited' | 'running';
  Running: boolean;
  Paused: boolean;
  Restarting: boolean;
  OOMKilled: false;
  Dead: boolean;
  Pid: number;
  ExitCode: number;
  Error: string;
  StartedAt: Date;
  FinishedAt: Date;
}
