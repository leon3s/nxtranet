import type {
  ModelCluster,
  ModelContainer,
  ModelEnvVar,
  ModelPipeline
} from '@nxtranet/headers';
import React from 'react';
import {AiOutlinePlus} from 'react-icons/ai';
import Accordion from '~/components/Shared/Accordion';
import ActionBar, {ActionWrapper} from '~/components/Shared/ActionBar';
import ClusterContainer from '~/components/Shared/ClusterContainer';
import EnvVar from '~/components/Shared/EnvVar';
import InfoRow from '~/components/Shared/InfoRow';
import ItemRounded from '~/components/Shared/ItemRounded';
import * as AccordionStyle from '~/styles/accordionLine';
import * as Style from './style';

type CusterCardProps = {
  data: ModelCluster;
  isVisible?: boolean;
  onClick: (data: ModelCluster) => void;
  onClickShowContainer: (container: ModelContainer) => void;
  onClickDeleteEnvVar: (data: ModelEnvVar) => void;
  onClickDeleteContainer: (data: ModelContainer) => void;
  onClickEditEnvVar: (data: ModelEnvVar) => void;
  onClickCreateEnvVar: (namespace: string) => void;
  onClickCreateContainer: () => void;
  onClickClusterDeploy: () => void;
  onClickOpenPipelineLinkModal: (data: ModelCluster) => void;
  onClickPipelineLink: (data: ModelCluster, item: ModelPipeline) => void;
}

export default function ClusterCard(props: CusterCardProps) {
  const {
    data,
    isVisible,
    onClickShowContainer,
    onClickDeleteEnvVar,
    onClickEditEnvVar,
    onClickClusterDeploy,
    onClickDeleteContainer,
  } = props;

  function onClick() {
    props.onClick(data);
  }

  function onClickCreateEnvVar() {
    props.onClickCreateEnvVar(data.namespace);
  }

  function onClickOpenPipelineLinkModal() {
    props.onClickOpenPipelineLinkModal(data);
  }

  function onGenerateClickPipelineLink(item: ModelPipeline) {
    return () => {
      props.onClickPipelineLink(data, item);
    }
  }

  const infoRow = [
    {
      label: 'Type',
      value: data.type,
    },
    {
      label: 'Hostname',
      href: `http://${data.hostname}`,
      target: '_blank',
      value: data.hostname,
    },
    {
      label: 'Host',
      value: data.host,
    },
    {
      label: 'Git branch',
      value: data.gitBranch?.name || 'any',
    },
  ]

  return (
    <AccordionStyle.AccordionContainer>
      <Accordion
        onClick={onClick}
        isVisible={isVisible}
        title={
          <AccordionStyle.AccordionTitle>
            {data.name}
          </AccordionStyle.AccordionTitle>
        }
        content={
          <AccordionStyle.AccordionContent>
            <Style.ClusterContent>
              {infoRow.map((info) => (
                <InfoRow
                  key={info.label}
                  {...info}
                />
              ))}
              <Style.Title>
                Pipelines
              </Style.Title>
              <ActionWrapper>
                <ActionBar actions={[
                  {
                    title: 'Create',
                    icon: () => <AiOutlinePlus size={12} />,
                    fn: onClickOpenPipelineLinkModal,
                  }
                ]} />
              </ActionWrapper>
              <Style.EnvVars>
                {data?.pipelines?.map((pipeline) => (
                  <ItemRounded
                    key={pipeline.id}
                    onClick={onGenerateClickPipelineLink(pipeline)}
                  >
                    {pipeline.name}
                  </ItemRounded>
                ))}
              </Style.EnvVars>
              <Style.Title>
                Environement Variables
              </Style.Title>
              <ActionWrapper>
                <ActionBar actions={[
                  {
                    title: 'New environement variable',
                    icon: () => <AiOutlinePlus size={12} />,
                    fn: onClickCreateEnvVar,
                  }
                ]} />
              </ActionWrapper>
              <Style.EnvVars>
                {data?.envVars?.map((envVar) => (
                  <EnvVar
                    data={envVar}
                    key={envVar.id}
                    onClickEdit={onClickEditEnvVar}
                    onClickDelete={onClickDeleteEnvVar}
                  />
                ))}
              </Style.EnvVars>
              <Style.Title>
                Containers
              </Style.Title>
              <ActionWrapper>
                <ActionBar actions={[
                  {
                    title: 'New container',
                    icon: () => <AiOutlinePlus size={12} />,
                    fn: onClickClusterDeploy,
                  }
                ]} />
              </ActionWrapper>
              <Style.ClusterContainers>
                {data?.containers?.map((container) => (
                  <ClusterContainer
                    data={container}
                    key={container.id}
                    onClickShow={onClickShowContainer}
                    onClickDelete={onClickDeleteContainer}
                  />
                ))}
              </Style.ClusterContainers>
            </Style.ClusterContent>
          </AccordionStyle.AccordionContent>
        }
      />
    </AccordionStyle.AccordionContainer>
  )
}
