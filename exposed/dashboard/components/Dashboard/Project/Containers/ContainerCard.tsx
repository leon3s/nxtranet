import type {ModelContainer, ModelProject} from '@nxtranet/headers';
import React from 'react';
import Accordion from '~/components/Shared/Accordion';
import InfoRow from '~/components/Shared/InfoRow';
import PipelineBadge from '~/components/Shared/PipelineBadge';
import * as AccordionStyle from '~/styles/accordionLine';
import * as Style from './style';

type ContainerCardProps = {
  projectName: string;
  data: ModelContainer;
  project: ModelProject;
  isVisible?: boolean;
  onClick: (data: ModelContainer) => void;
}

export default function ContainerCard(props: ContainerCardProps) {
  const {
    data,
    isVisible,
    projectName,
  } = props;

  function onClick() {
    props.onClick(data);
  }
  const domain = data.cluster?.hostname;
  const infoRow = [
    {
      label: 'Port',
      value: data.appPort,
    },
    {
      label: 'Cluster',
      href: `/dashboard/projects/${projectName}/clusters/${data?.cluster?.name}`,
      value: data.clusterNamespace,
    },
    {
      label: 'Hostname',
      href: `http://${data.name}.${domain}`,
      target: '_blank',
      value: `${data.name}.${domain}`,
    },
  ]
  return (
    <AccordionStyle.AccordionContainer>
      <Accordion
        onClick={onClick}
        isVisible={isVisible}
        title={
          <Style.AccordionHeader>
            <AccordionStyle.AccordionTitle>
              {data.name} ({data?.cluster?.name})
            </AccordionStyle.AccordionTitle>
            <PipelineBadge
              status={data?.pipelineStatus?.value || 'STARTING'}
              color={data?.pipelineStatus?.pipeline?.color || 'grey'}
            />
          </Style.AccordionHeader>
        }
        content={
          <AccordionStyle.AccordionContent>
            <Style.AccordionContent>
              {infoRow.map((info) => (
                <InfoRow
                  key={info.label}
                  {...info}
                />
              ))}
              <Style.Title>
                Outputs
              </Style.Title>
              <Style.ContainerOutputWrapper
                className="scroll-bar"
              >
                <Style.ContainerOutput
                >
                  {(data.outputs || []).map((output, i) => {
                    if (output.isFirst) {
                      return (
                        <Style.Command
                          key={output.id}
                        >
                          {!i ?
                            null
                            :
                            <br />
                          }
                          {data.namespace} $&gt; {output.exe} {output.args.join(' ')} <br />
                        </Style.Command>
                      )
                    }
                    if (output.stderr) {
                      return (
                        <Style.Stderr
                          key={output.id}
                        >
                          {output.stderr}
                        </Style.Stderr>
                      )
                    }
                    if (output.stdout) {
                      return (
                        <Style.Stdout
                          key={output.id}
                        >
                          {output.stdout}
                        </Style.Stdout>
                      )
                    }
                    return null;
                  })}
                </Style.ContainerOutput>
              </Style.ContainerOutputWrapper>
            </Style.AccordionContent>
          </AccordionStyle.AccordionContent>
        }
      />
    </AccordionStyle.AccordionContainer>
  )
}
