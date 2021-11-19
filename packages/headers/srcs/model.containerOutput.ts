export type           ModelContainerOutput = {
  id:                 string;
  exe:                string;
  args:               string[];
  isFirst:            boolean;
  isLast:             boolean;
  stdout?:            string;
  stderr?:            string;
  exitCode?:          number;
  signal?:            string;
  signalDescription:  string;
}
