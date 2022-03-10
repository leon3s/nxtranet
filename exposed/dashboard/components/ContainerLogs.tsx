import type {ModelContainer} from '@nxtranet/headers';
import React from 'react';
import * as Style from './ContainerLogs.s';

type ContainerLogsProps = {
  data: ModelContainer;
}

const ContainerLogs = (props: ContainerLogsProps) => {
  const {data} = props;
  return (
    <Style.ContainerLogsWrapper
      className="scroll-bar"
    >
      <Style.ContainerLogs
      >
        {(data.outputs || []).map((output) => {
          if (output.isFirst) {
            return (
              <Style.Command
                key={output.id}
              >
                {data.namespace} $&gt; {output.exe} {output.args.join(' ')} <br />
              </Style.Command>
            );
          }
          if (output.stderr) {
            return (
              <Style.Stderr
                key={output.id}
              >
                {output.stderr}
              </Style.Stderr>
            );
          }
          if (output.stdout) {
            return (
              <Style.Stdout
                key={output.id}
              >
                {output.stdout}
              </Style.Stdout>
            );
          }
          return null;
        })}
      </Style.ContainerLogs>
    </Style.ContainerLogsWrapper>
  );
};

export default ContainerLogs;
