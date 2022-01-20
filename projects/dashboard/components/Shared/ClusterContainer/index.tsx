import type {ModelContainer} from '@nxtranet/headers';
import React from 'react';
import PipelineBadge from '../PipelineBadge';
import * as Style from './style';

type ClusterContainerProps = {
  data: ModelContainer;
  onClickShow: (data: ModelContainer) => void;
  onClickDelete: (data: ModelContainer) => void;
}

export default function ClusterContainer(props: ClusterContainerProps) {
  function onClickDelete() {
    props.onClickDelete(props.data);
  }

  function onClickShow() {
    props.onClickShow(props.data);
  }
  return (
    <Style.Container>
      <Style.Overlay>
        <Style.Delete
          onClick={onClickDelete}
          title="Delete"
        >

        </Style.Delete>
        <Style.Edit
          title="Show"
          onClick={onClickShow}
        >

        </Style.Edit>
      </Style.Overlay>
      <PipelineBadge
        status={props.data?.pipelineStatus.value}
        color={props.data?.pipelineStatus?.pipeline?.color || 'grey'}
      />
      <Style.LineTitle>
        {props.data.gitBranchName}
      </Style.LineTitle>
      <Style.LinePort>
        {props.data.appPort}
      </Style.LinePort>
    </Style.Container>
  )
}
