import type {ModelContainer, ModelProject} from '@nxtranet/headers';
import Link from 'next/link';
import React from 'react';
import Accordion from '~/components/Shared/Accordion';
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
    project,
    isVisible,
    projectName,
  } = props;
  function onClick() {
    props.onClick(data);
  }
  console.log('container card props', {
    props,
  })
  const domain = project?.clusterProduction?.domain || process.env.NXTRANET_DOMAIN;
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

              <Style.ContainerLine>
                <Style.ContainerTitle>
                  name
                </Style.ContainerTitle>
                <Link
                  passHref
                  href={`http://${data.name}.${domain}`}
                >
                  <Style.ContainerValueLink
                    target="_blank"
                  >
                    {data.name}
                  </Style.ContainerValueLink>
                </Link>
              </Style.ContainerLine>

              <Style.ContainerLine>
                <Style.ContainerTitle>
                  cluster
                </Style.ContainerTitle>
                <Link
                  passHref
                  href={`/dashboard/projects/${projectName}/clusters/${data?.cluster?.name}`}
                >
                  <Style.ContainerValueLink>
                    {data.clusterNamespace}
                  </Style.ContainerValueLink>
                </Link>
              </Style.ContainerLine>

              <Style.ContainerLine>
                <Style.ContainerTitle>
                  Port
                </Style.ContainerTitle>
                <Style.ContainerValue>
                  {data.appPort}
                </Style.ContainerValue>
              </Style.ContainerLine>

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
