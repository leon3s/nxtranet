import type {
  ModelCluster, ModelContainer,
  ModelEnvVar,
  ModelPipeline
} from '@nxtranet/headers';
import {ModelClusterType} from '@nxtranet/headers';
import Link from 'next/link';
import React from 'react';
import {IconCluster, IconDelete, IconPlus, IconSetting} from '~/styles/icons';
import Accordion from './Accordion';
import * as AccordionCard from './AccordionCard';
import ActionBar, {ActionWrapper} from './ActionBar';
import * as CardTitle from './CardTitle';
import * as Style from './ClusterCard.s';
import InfoRow from './InfoRow';
import LoadingBackground from './LoadingBackground';

export type ClusterCardProps = {
  data?: ModelCluster;
  isVisible?: boolean;
  isExtended?: boolean;
  isLoading?: boolean;
  onClick?: (data: ModelCluster) => void;
  onClickShowContainer?: (container: ModelContainer) => void;
  onClickDeleteEnvVar?: (data: ModelEnvVar) => void;
  onClickDeleteContainer?: (data: ModelContainer) => void;
  onClickEditEnvVar?: (data: ModelEnvVar) => void;
  onClickCreateEnvVar?: (namespace: string) => void;
  onClickCreateContainer?: () => void;
  onClickClusterDeploy?: () => void;
  onClickOpenPipelineLinkModal?: (data: ModelCluster) => void;
  onClickPipelineLink?: (data: ModelCluster, item: ModelPipeline) => void;
  onClickOpenModalDelete?: (data: ModelCluster) => void;
}

const defaultProps = {
  isExtended: false,
  isLoading: true,
  onClick: () => {},
  onClickShowContainer: () => {},
  onClickDeleteEnvVar: () => {},
  onClickDeleteContainer: () => {},
  onClickEditEnvVar: () => {},
  onClickCreateEnvVar: () => {},
  onClickCreateContainer: () => {},
  onClickClusterDeploy: () => {},
  onClickOpenPipelineLinkModal: () => {},
  onClickPipelineLink: () => {},
  onClickOpenModalDelete: () => {},
  data: {
    id: 'testID',
    projectName: 'testProjectName',
    creationDate: new Date(),
    type: ModelClusterType.TESTING,
    name: 'cluster_name',
    envVars: [],
    containers: [],
    host: "127.0.0.1",
    gitBranchNamespace: "",
    namespace: 'testNamespace',
    hostname: process.env.NXTRANET_HOSTNAME || "nxtra.net",
    pipelines: [],
  }
};

function ClusterCard(props: ClusterCardProps) {
  const {
    isExtended,
    isVisible,
    isLoading,
    onClickShowContainer,
    onClickDeleteEnvVar,
    onClickEditEnvVar,
    onClickClusterDeploy,
    onClickDeleteContainer,
  } = props;

  const data = props.data || defaultProps.data;

  function onClick(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    props.onClick && props.onClick(data);
  }

  function onClickCreateEnvVar() {
    // props.onClickCreateEnvVar(data.namespace);
  }

  function onClickOpenPipelineLinkModal() {
    // props.onClickOpenPipelineLinkModal(data);
  }

  function onGenerateClickPipelineLink(item: ModelPipeline) {
    return () => {
      // props.onClickPipelineLink(data, item);
    };
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
      value: data?.gitBranch?.name || 'any',
    },
  ];

  function onClickOpenModalEdit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
  }

  function onClickOpenModalDelete(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    props.onClickOpenModalDelete(data);
  }

  function preventLink(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
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
                  `/dashboard/projects/${data.projectName}/clusters/${data.name}`
                  : `/dashboard/projects/${data.projectName}/clusters`
              }
            >
              <Style.HiddenLink>
                <AccordionCard.AccordionTitleContainer>
                  <Style.ClusterCardTitleContainer>
                    <AccordionCard.AccordionTitle>
                      <IconCluster size={16} />
                      {data.name}
                    </AccordionCard.AccordionTitle>
                    <Style.ClusterCardTitleActions>
                      <ActionWrapper
                        isVisible={false}
                      >
                        <ActionBar actions={[
                          {
                            title: 'Edit',
                            icon: () => <IconSetting size={12} />,
                            fn: onClickOpenModalEdit,
                          },
                          {
                            title: 'Delete',
                            icon: () => <IconDelete size={12} />,
                            fn: onClickOpenModalDelete,
                          }
                        ]} />
                      </ActionWrapper>
                    </Style.ClusterCardTitleActions>
                  </Style.ClusterCardTitleContainer>
                </AccordionCard.AccordionTitleContainer>
              </Style.HiddenLink>
            </Link>
          }
          content={
            <AccordionCard.AccordionContent>
              {isLoading ? <LoadingBackground /> : null}
              <Style.ClusterContent>
                <CardTitle.CardTitleContainer>
                  <CardTitle.CardTitleText>
                    Settings
                  </CardTitle.CardTitleText>
                </CardTitle.CardTitleContainer>
                <Style.ClusterColumn>
                  {infoRow.map((info) => (
                    <InfoRow
                      key={info.label}
                      {...info}
                    />
                  ))}
                </Style.ClusterColumn>
                <CardTitle.CardTitleContainer>
                  <CardTitle.CardTitleText>
                    Pipeline links
                  </CardTitle.CardTitleText>
                  <ActionWrapper
                    isVisible={isExtended}
                  >
                    <ActionBar actions={[
                      {
                        title: 'New pipeline',
                        icon: () => <IconPlus size={12} />,
                        fn: onClickOpenPipelineLinkModal,
                      }
                    ]} />
                  </ActionWrapper>
                </CardTitle.CardTitleContainer>
                <Style.ClusterLine>
                  {/* {data?.pipelines?.map((pipeline) => (
                    <ItemRounded
                      key={pipeline.id}
                      onClick={onGenerateClickPipelineLink(pipeline)}
                    >
                      {pipeline.name}
                    </ItemRounded>
                  ))} */}
                </Style.ClusterLine>
                <CardTitle.CardTitleContainer>
                  <CardTitle.CardTitleText>
                    Environement Variables
                  </CardTitle.CardTitleText>
                  <ActionWrapper
                    isVisible={isExtended}
                  >
                    <ActionBar actions={[
                      {
                        title: 'New environement variable',
                        icon: () => <IconPlus size={12} />,
                        fn: onClickCreateEnvVar,
                      }
                    ]} />
                  </ActionWrapper>
                </CardTitle.CardTitleContainer>
                <Style.ClusterLine>
                  {/* {data?.envVars?.map((envVar) => (
                    <EnvVar
                      data={envVar}
                      key={envVar.id}
                      onClickEdit={onClickEditEnvVar}
                      onClickDelete={onClickDeleteEnvVar}
                    />
                  ))} */}
                </Style.ClusterLine>
                <CardTitle.CardTitleContainer>
                  <CardTitle.CardTitleText>
                    Containers
                  </CardTitle.CardTitleText>
                  <ActionWrapper
                    isVisible={isExtended}
                  >
                    <ActionBar actions={[
                      {
                        title: 'New container',
                        icon: () => <IconPlus size={12} />,
                        fn: onClickClusterDeploy,
                      }
                    ]} />
                  </ActionWrapper>
                </CardTitle.CardTitleContainer>
                <Style.ClusterContainers>
                  {/* {data?.containers?.map((container) => (
                    // <ClusterContainer
                    //   data={container}
                    //   key={container.id}
                    //   onClickShow={onClickShowContainer}
                    //   onClickDelete={onClickDeleteContainer}
                    // />
                  ))} */}
                </Style.ClusterContainers>
              </Style.ClusterContent>

            </AccordionCard.AccordionContent>
          }
        />
      </AccordionCard.AccordionContainer>
    </Style.ContainerAnimed>
  );
}

ClusterCard.defaultProps = defaultProps;

export default ClusterCard;
