import React from 'react';

import * as Style from './style';

type ActionBarAction = {
  title: string;
  icon: () => React.ReactChild;
  fn: () => void;
}

type ActionBarProps = {
  actions: ActionBarAction[]
}

export default (props: ActionBarProps) => (
  <Style.Container>
    <Style.Buttons>
      {props.actions.map((action, i) => (
        <Style.Button
          title={action.title}
          onClick={action.fn}
          key={`action-bar-action-${action.title}-${i}`}
        >
          {action.icon()}
        </Style.Button>
      ))}
    </Style.Buttons>
  </Style.Container>

)