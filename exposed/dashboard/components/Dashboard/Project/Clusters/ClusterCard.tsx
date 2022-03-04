import type {
  ModelCluster,
  ModelContainer,
  ModelEnvVar,
  ModelPipeline
} from '@nxtranet/headers';
import React from 'react';
import {AiOutlinePlus} from 'react-icons/ai';
import api from '~/api';
import Accordion from '~/components/Shared/Accordion';
import ActionBar, {ActionWrapper} from '~/components/Shared/ActionBar';
import ClusterContainer from '~/components/Shared/ClusterContainer';
import EnvVar from '~/components/Shared/EnvVar';
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
  onClicClusterDeploy: () => void;
}

export default function ClusterCard(props: CusterCardProps) {
  const {
    data,
    isVisible,
    onClickShowContainer,
    onClickDeleteEnvVar,
    onClickEditEnvVar,
    onClicClusterDeploy,
    onClickDeleteContainer,
  } = props;

  function onClick() {
    props.onClick(data);
  }

  function onClickCreateEnvVar() {
    props.onClickCreateEnvVar(data.namespace);
  }

  async function onAddClusterPipeline(item: ModelPipeline) {
    await api.post(`/clusters/${data.id}/pipelines/${item.id}/link`);
  }

  async function onRemoveClusterPipeline(item: ModelPipeline) {
    await api.delete(`/clusters/${data.id}/pipelines/${item.id}/link`);
  }

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
              <Style.Title>
                Pipelines
              </Style.Title>
              <ActionWrapper>
                <ActionBar actions={[
                  {
                    title: 'Create',
                    icon: () => <AiOutlinePlus size={12} />,
                    fn: onClickCreateEnvVar,
                  }
                ]} />
              </ActionWrapper>
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
                    fn: onClicClusterDeploy,
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
