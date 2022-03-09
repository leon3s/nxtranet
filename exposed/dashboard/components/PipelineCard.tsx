import type {ModelPipeline, ModelPipelineCmd} from '@nxtranet/headers';
import Link from 'next/link';
import React from 'react';
import {IconDelete, IconPlus} from '~/styles/icons';
import Accordion from './Accordion';
import * as AccordionCard from './AccordionCard';
import ActionBar, {ActionWrapper} from './ActionBar';
import * as CardTitle from './CardTitle';
import LoadingBackground from './LoadingBackground';
import * as Style from './PipelineCard.s';
import PipelineStatus from './PipelineStatus';

export type PipelineCardProps = {
  data: ModelPipeline;
  isVisible?: boolean;
  isExtended?: boolean;
  isLoading?: boolean;
  onClick?: (data: ModelPipeline) => void;
  onClickNewCmd?: (data: ModelPipeline) => void;
  onClickDeleteCmd?: (data: ModelPipelineCmd) => void;
}

const defaultProps = {
  isExtended: false,
  isLoading: true,
  onClick: () => {},
};

function PipelineCard(props: PipelineCardProps) {
  const {
    data,
    isExtended,
    isVisible,
    isLoading,
  } = props;

  function onClick(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    props.onClick &&
      props.onClick(data);
  }

  function onClickDeletePipeline() {

  }

  function generateOnClickDeleteCmd(cmd: ModelPipelineCmd) {
    return function onClickDeleteCmd() {
      props.onClickDeleteCmd &&
        props.onClickDeleteCmd(cmd);
    };
  }

  function onClickNewCmd() {
    props.onClickNewCmd &&
      props.onClickNewCmd(data);
  }

  return (
    <Style.ContainerAnimed
      isVisible={isVisible}
    >
      <AccordionCard.AccordionContainer>
        <Accordion
          onClick={onClick}
          isVisible={isExtended}
          title={
            <Link
              passHref
              shallow
              prefetch={false}
              href={
                !isExtended ?
                  `/dashboard/projects/${data.projectName}/pipelines/${data.name}`
                  : `/dashboard/projects/${data.projectName}/pipelines`
              }
            >
              <Style.HiddenLink>
                <AccordionCard.AccordionTitleContainer>
                  <Style.PipelineCardTitleContainer>
                    <Style.PipelineCardTitleHeader>
                      <PipelineStatus
                        color={data.color}
                      />
                      <AccordionCard.AccordionTitle>
                        {data.name}
                      </AccordionCard.AccordionTitle>
                    </Style.PipelineCardTitleHeader>
                    <ActionWrapper
                      isVisible={false}
                    >
                      <ActionBar actions={[
                        {
                          title: 'Delete',
                          icon: () => <IconDelete size={12} />,
                          fn: onClickDeletePipeline,
                        }
                      ]} />
                    </ActionWrapper>
                  </Style.PipelineCardTitleContainer>
                </AccordionCard.AccordionTitleContainer>
              </Style.HiddenLink>
            </Link>
          }
          content={
            <AccordionCard.AccordionContent>
              <Style.PipelineContent>
                {isLoading ? <LoadingBackground /> : null}
                <Style.PipelineCardContentHeader>
                  <CardTitle.CardTitleContainer>
                    <CardTitle.CardTitleText>
                      Commands
                    </CardTitle.CardTitleText>
                    <ActionWrapper
                      isVisible
                    >
                      <ActionBar actions={[
                        {
                          title: 'New command',
                          icon: () => <IconPlus size={12} />,
                          fn: onClickNewCmd,
                        }
                      ]} />
                    </ActionWrapper>
                  </CardTitle.CardTitleContainer>
                </Style.PipelineCardContentHeader>
                <Style.PipelineCmdContainer>
                  {(data.commands || []).map((command) => (
                    <Style.PipelineCmdRow
                      key={command.id}
                    >
                      <Style.PipelineCmdText>
                        {`\$> ${command.name} ${command.args.join(' ')}`}
                      </Style.PipelineCmdText>
                      <ActionWrapper
                        isVisible
                      >
                        <ActionBar actions={[
                          {
                            title: 'Delete command',
                            icon: () => <IconDelete size={12} />,
                            fn: generateOnClickDeleteCmd(command),
                          }
                        ]} />
                      </ActionWrapper>
                    </Style.PipelineCmdRow>
                  ))}
                </Style.PipelineCmdContainer>
              </Style.PipelineContent>
            </AccordionCard.AccordionContent>
          }
        />
      </AccordionCard.AccordionContainer>
    </Style.ContainerAnimed>
  );
}

// {`\$> ${command.name} ${command.args.join(' ')}\n`}

PipelineCard.defaultProps = defaultProps;

export default PipelineCard;
