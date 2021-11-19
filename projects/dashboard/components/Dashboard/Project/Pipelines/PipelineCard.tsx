import React from 'react';

import Reform from '~/components/Shared/ReForm';
import Accordion from '~/components/Shared/Accordion';
import PipelineBadge from '~/components/Shared/PipelineBadge';

import type { ModelPipeline, ModelPipelineCmd } from '@nxtranet/headers';

import * as AccordionStyle from '~/styles/accordionLine';
import * as Style from './style';

type PipelineCardProps = {
  isVisible: boolean;
  data: ModelPipeline;
  onClick: (data: ModelPipeline) => void;
  onCreatePipelineCmd: (namespace: string, data: Partial<ModelPipelineCmd>) => Promise<void>;
};

export default function PipelineCard(props: PipelineCardProps) {
  const {
    data,
    isVisible,
    onCreatePipelineCmd,
  } = props;
  function onClick() {
    props.onClick(data);
  }

  async function onSubmitPipelineCmdForm(formData: {cmd: string[] }) {
    const [name, ...args] = formData.cmd;
    const pipelineCmd: Partial<ModelPipelineCmd> = {
      name,
      args,
    };
    await onCreatePipelineCmd(data.namespace, pipelineCmd);
  }

  return (
    <AccordionStyle.AccordionContainer>
      <Accordion
        onClick={onClick}
        isVisible={isVisible}
        title={
          <Style.PipelineCardHeader>
            <PipelineBadge color={data.color} />
            <AccordionStyle.AccordionTitle>
              {data.name}
            </AccordionStyle.AccordionTitle>
          </Style.PipelineCardHeader>
        }
        content={
          <Style.PipelineCard>
            <Reform
              schema={[
                {title: 'Command', key: 'cmd', type: 'ArrayString'},
              ]}
              submitTitle={"Add"}
              isButtonCancelEnabled={false}
              onSubmit={onSubmitPipelineCmdForm}
            />
            <Style.CommandContainer>
              <Style.CommandCode>
                {(data.commands || []).map((command) => (
                  <Style.Command
                    key={command.id}
                  >
                    {`\$> ${command.name} ${command.args.join(' ')}\n`}
                  </Style.Command>
                ))}
              </Style.CommandCode>
            </Style.CommandContainer>
          </Style.PipelineCard>
        }
      />
    </AccordionStyle.AccordionContainer>
  )
}
