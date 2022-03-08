import type {ModelContainer} from '@nxtranet/headers';
import moment from 'moment';
import Link from 'next/link';
import React from 'react';
import {IconDelete} from '~/styles/icons';
import ActionBar, {ActionWrapper} from './ActionBar';
import * as Style from './ContainerCard.s';

export type ContainerCardProps = {
  data: ModelContainer;
  shallow?: boolean;
  baseUrl?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  onClickDelete?: (data: ModelContainer) => void;
}

const ContainerCard = (props: ContainerCardProps) => {
  const {data, baseUrl, onClick, shallow} = props;

  function onClickDelete (e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    props.onClickDelete
      && props.onClickDelete(data);
  }

  return (
    <Style.ContainerCardContainer>
      <Link
        passHref
        shallow={shallow}
        href={`${baseUrl ? baseUrl : ''}/containers/${data.name}`}
      >
        <Style.HiddenLink
          onClick={onClick}
        >
          <Style.ContainerCardIcon>
            <Style.PipelineStatusContainer>
              <Style.PipelineStatusBigger
                status={data?.pipelineStatus?.value || 'STARTING'}
                color={data?.pipelineStatus?.pipeline?.color || 'grey'}
              />
            </Style.PipelineStatusContainer>
            <Style.ContainerIcon size={50} />
          </Style.ContainerCardIcon>
          <Style.ContainerCardContent>
            <Style.ContainerCardTitle>
              {data.name}
            </Style.ContainerCardTitle>
            <Style.ContainerCardDescription>
              {moment(data?.creationDate || new Date()).format("DD/MM/YYYY HH:mm")}
            </Style.ContainerCardDescription>
          </Style.ContainerCardContent>
          <Style.ContainerCardActions>
            <ActionWrapper
              isVisible
            >
              <ActionBar actions={[{
                title: `Delete`,
                icon: () => <IconDelete size={12} />,
                fn: onClickDelete,
              }]} />
            </ActionWrapper>
          </Style.ContainerCardActions>
        </Style.HiddenLink>
      </Link>
    </Style.ContainerCardContainer>
  );
};

ContainerCard.defaultProps = {
  shallow: false,
};

export default ContainerCard;
