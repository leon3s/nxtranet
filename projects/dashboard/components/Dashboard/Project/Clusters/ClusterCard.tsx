import type {ModelCluster, ModelContainer, ModelEnvVar} from '@nxtranet/headers';
import React from 'react';
import {AiOutlinePlus} from 'react-icons/ai';
import Accordion from '~/components/Shared/Accordion';
import ActionBar from '~/components/Shared/ActionBar';
import ClusterContainer from '~/components/Shared/ClusterContainer';
import EnvVar from '~/components/Shared/EnvVar';
import * as AccordionStyle from '~/styles/accordionLine';
import {ActionWrapper} from '../style';
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
}

export default function ClusterCard(props: CusterCardProps) {
  const {
    data,
    isVisible,
    onClickShowContainer,
    onClickDeleteEnvVar,
    onClickEditEnvVar,
    onClickCreateContainer,
    onClickDeleteContainer,
  } = props;

  function onClick() {
    props.onClick(data);
  }

  function onClickCreateEnvVar() {
    props.onClickCreateEnvVar(data.namespace);
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
                Environement Variables
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
