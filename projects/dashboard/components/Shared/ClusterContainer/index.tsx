import React from 'react';

import PipelineBadge from '../PipelineBadge';

import type { ModelContainer } from '@nxtranet/headers';

type ClusterContainerProps = {
  data: ModelContainer;
  onClickShow: (data: ModelContainer) => void;
  onClickDelete: (data: ModelContainer) => void;
}

import * as Style from './style';

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
      <PipelineBadge color={props.data?.pipelineStatus?.pipeline?.color || 'grey'} />
      <Style.LineTitle>
        {props.data.gitBranchName}
      </Style.LineTitle>
      <Style.LinePort>
        {props.data.appPort}
      </Style.LinePort>
    </Style.Container>
  )
}
