import {ModelContainer, PipelineStatusEnum} from '@nxtranet/headers';
import moment from 'moment';
import React from 'react';
import * as Style from './ContainerInspect.s';
import InfoRow from './InfoRow';
import PipelineStatus from './PipelineStatus';

export type ContainerProps = {
  data?: ModelContainer;
}

const Container = (props: ContainerProps) => {
  const {data} = props;
  const domain = data?.cluster?.hostname || 'test-hostname.com';

  console.log(data?.creationDate);
  data?.pipelineStatus.pipeline?.name;
  const infoRow = [
    {
      label: 'Status',
      value: <PipelineStatus
        status={data?.pipelineStatus?.value || PipelineStatusEnum.STARTING}
        color={data?.pipelineStatus?.pipeline?.color || 'grey'}
      />,
    },
    {
      label: 'Created',
      value: moment(data?.creationDate || new Date()).format("DD/MM/YYYY HH:mm"),
    },
    {
      label: 'Cluster',
      value: data?.cluster?.name || 'name',
    },
    {
      label: 'Branch',
      value: data?.gitBranchName || 'branch name',
    },
    {
      label: 'Commit',
      value: data?.commitSHA || 'commit',
    },
    {
      label: 'Hostname',
      // href: `http://${data.name}.${domain}`,
      // target: '_blank',
      value: `${data?.name || 'test-name'}.${domain || 'test-domain'}`,
    },
    {
      label: 'Port',
      value: data?.appPort?.toString() || '3000',
    },
    {
      label: 'dockerID',
      value: data?.dockerID || 'dockerID',
    },
  ];

  return (
    <Style.Content>
      {infoRow.map((info) => (
        <InfoRow
          key={info.label}
          {...info}
        />
      ))}
    </Style.Content>
  );
};

export default Container;
