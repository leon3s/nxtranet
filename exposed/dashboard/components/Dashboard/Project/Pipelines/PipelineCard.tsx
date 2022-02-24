import type {ModelPipeline, ModelPipelineCmd} from '@nxtranet/headers';
import React, {useState} from 'react';
import Accordion from '~/components/Shared/Accordion';
import PipelineBadge from '~/components/Shared/PipelineBadge';
import Reform from '~/components/Shared/ReForm';
import * as AccordionStyle from '~/styles/accordionLine';
import * as Style from './style';

type PipelineCardProps = {
  isVisible: boolean;
  data: ModelPipeline;
  onClick: (data: ModelPipeline) => void;
  onCreatePipelineCmd: (namespace: string, data: Partial<ModelPipelineCmd>) => Promise<void>;
  onPatchPipelineCmd: (namespace: string, data: ModelPipelineCmd) => Promise<void>;
};

export default function PipelineCard(props: PipelineCardProps) {
  const {
    data,
    isVisible,
    onCreatePipelineCmd,
    onPatchPipelineCmd,
  } = props;

  const [commandToEdit, setCommandToEdit] = useState<ModelPipelineCmd | null>(null);
  const [formData, setFormData] = useState<{cmd: string[]}>({
    cmd: []
  });

  function onClick() {
    props.onClick(data);
  }

  async function onSubmitPipelineCmdForm(formData: {cmd: string[]}) {
    const [name, ...args] = formData.cmd;
    const pipelineCmd: Partial<ModelPipelineCmd> = {
      name,
      args,
    };
    if (commandToEdit) {
      await onPatchPipelineCmd(data.namespace, {
        ...commandToEdit,
        ...pipelineCmd,
      });
      setCommandToEdit(null);
    } else {
      await onCreatePipelineCmd(data.namespace, pipelineCmd);
    }
    setFormData({
      cmd: [],
    });
  }

  function onCommandEditGenerator(cmd: ModelPipelineCmd) {
    return function onCommandEdit() {
      setCommandToEdit(cmd);
      setFormData({
        cmd: [cmd.name, ...cmd.args],
      });
    }
  }

  function onFormCancel() {
    if (commandToEdit) {
      setCommandToEdit(null);
    }
    setFormData({cmd: []});
  }

  return (
    <AccordionStyle.AccordionContainer>
      <Accordion
        onClick={onClick}
        isVisible={isVisible}
        title={
          <Style.PipelineCardHeader>
            <AccordionStyle.AccordionTitle>
              {data.name}
            </AccordionStyle.AccordionTitle>
            <PipelineBadge color={data.color} />
          </Style.PipelineCardHeader>
        }
        content={
          <Style.PipelineCard>
            <Reform
              schema={[
                {title: 'Command', key: 'cmd', type: 'ArrayString'},
              ]}
              data={formData}
              isButtonLoadingResolving
              onSubmit={onSubmitPipelineCmdForm}
              onCancel={onFormCancel}
              isButtonCancelEnabled={!!commandToEdit}
              submitTitle={commandToEdit ? 'Update' : 'Create'}
            />
            <Style.CommandContainer>
              <Style.CommandCode>
                {(data.commands || []).map((command) => (
                  <Style.CommandWrapper
                    key={command.id}
                  >
                    <Style.CommandOptions>
                      <Style.CommandEdit
                        size={12}
                        onClick={onCommandEditGenerator(command)}
                        title="Edit"
                      />
                      <Style.CommandDelete
                        size={12}
                        title="Delete"
                      />
                    </Style.CommandOptions>
                    <Style.Command>
                      {`\$> ${command.name} ${command.args.join(' ')}\n`}
                    </Style.Command>
                  </Style.CommandWrapper>
                ))}
              </Style.CommandCode>
            </Style.CommandContainer>
          </Style.PipelineCard>
        }
      />
    </AccordionStyle.AccordionContainer>
  )
}
