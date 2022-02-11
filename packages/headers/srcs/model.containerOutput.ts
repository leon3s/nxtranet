export type ModelContainerOutput = {
  id: string;
  creationDate?: Date;
  containerNamespace: string;
  exe: string;
  cwd: string;
  isFirst: boolean;
  isLast: boolean;
  signal?: string;
  signalDescription?: string;
  exitCode?: number;
  args: string[];
  stdout?: string;
  stderr?: string;
}
