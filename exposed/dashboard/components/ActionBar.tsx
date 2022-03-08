import React from 'react';
import Styled from 'styled-components';
import * as Style from './ActionBar.s';

export type ActionBarAction = {
  title: string;
  icon: () => React.ReactChild;
  fn: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export type ActionBarProps = {
  actions: ActionBarAction[]
}

export type ActionWrapperProps = {
  isVisible?: boolean;
}

export const ActionWrapper = Styled.div<ActionWrapperProps>`
  display: flex;
  align-items: center;
  overflow: hidden;
${props => `
  ${props.isVisible ? `
    transition: min-height .4s, padding .4s, opacity 1.4s ease-in-out;
    min-height: ${props.theme.spacingLight * 2 + 20}px;
    opacity: 1;
  ` : `
    transition: min-height 1.4s, padding 1.4s, opacity .4s ease-in-out;
    opacity: 0;
    min-height: 0px;
    max-height: 0px;
  `}
`}`;

function ActionBar(props: ActionBarProps) {
  return (
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
  );
};

export default ActionBar;
