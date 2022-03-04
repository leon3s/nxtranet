import React from 'react';
import Styled from 'styled-components';
import {Title} from '~/styles/text';
import ActionBar, {ActionBarAction, ActionWrapper} from '../ActionBar';

export type PageTitleProps = {
  title: string;
  actions?: ActionBarAction[];
}

export const ProjectTitleContainer = Styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 8px;
  height: 36px;
  justify-content: space-between;
`;

export const ProjectTitle = Styled(Title)`
  margin: 0px;
  font-weight: bold;
  letter-spacing: 1px;
  :first-letter {
    text-transform: uppercase;
  }
  ${props => `
    color: ${props.theme.text.secondary};
  `}
`;

export default function PageTitle(props: PageTitleProps) {
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
  )
}
