import React from 'react';
import Styled from 'styled-components';
import type {ActionBarAction} from './ActionBar';
import ActionBar, {
  ActionWrapper
} from './ActionBar';
import Title from './Title';

export type DashboardTitleProps = {
  title: string;
  actions?: ActionBarAction[];
}

export const ProjectTitleContainer = Styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  margin: 0px 12px;
  height: 36px;
  justify-content: space-between;
  ${props => `
    padding-bottom: ${props.theme.spacing};
  `}
`;

export const ProjectTitle = Styled(Title)`
  margin: 0px;
  font-weight: bold;
  :first-letter {
    text-transform: uppercase;
  }
  ${props => `
    color: ${props.theme.text.color.secondary};
  `}
`;

export default function DashboardTitle(props: DashboardTitleProps) {
  return (
    <ProjectTitleContainer>
      <ProjectTitle>
        {props.title}
      </ProjectTitle>
      <ActionWrapper
        isVisible={!!props.actions}
      >
        <ActionBar actions={props.actions || []} />
      </ActionWrapper>
    </ProjectTitleContainer>
  );
}
