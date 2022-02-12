import React from 'react';
import Styled from 'styled-components';
import * as Style from './style';

type ActionBarAction = {
  title: string;
  icon: () => React.ReactChild;
  fn: () => void;
}

type ActionBarProps = {
  actions: ActionBarAction[]
}

export const ActionWrapper = Styled.div`
${props => `
  padding: ${props.theme.padding.light}px;
  padding-bottom: 0px;
`}`;

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
