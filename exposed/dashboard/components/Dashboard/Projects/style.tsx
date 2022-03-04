import Styled from 'styled-components';
import * as GlobalStyle from '~/styles/global';
import {A} from '~/styles/link';
import {Text} from '~/styles/text';

export const Container = Styled(GlobalStyle.Container)`
  flex: 1;
  width: 100%;
  display: flex;
  min-height: 100%;
  height: fit-content;
  flex-direction column;
  padding-top: 8px;
`;

export const ProjectsContainer = Styled.div`
  margin: 8px 8px 0px 8px;
  display: flex;
  flex-wrap: wrap;
  transition: all .4;
  gap: 8px;
`;

export const ModalContent = Styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

export const ProjectCardIcon = Styled.div`
  ${props => `
    color: ${props.theme.text.secondary};
  `}
`;

export const ProjectCardTitle = Styled(Text)`
  margin: 0px;
  padding: 4px 10px;
  font-size: 10px;
`;

export const ProjectCardContainer = Styled(A)`
  display: flex;
  padding: 6px;
  position: relative;
  flex-direction: row;
  cursor: pointer;
  transition: all .4;
  min-width: calc((100% / 4) - 6px);
  box-sizing: border-box;
  @media (max-width: 1024px) {
    min-width: calc((100% / 2) - 4px);
  }
  @media (max-width: 900px) {
    min-width: calc(100%);
  }
  border-radius: 2px;
  ${props => `
    box-shadow: ${props.theme.boxShadowAdvenced};
    :hover {
      background-color: rgba(224, 255, 255, 0.6) !important;
    }
  `}
`;

export const ProjectCardTitleContainer = Styled.div`
`;

export const ProjectCardDescription = Styled.div`
`;

export const ProjectCardSubLink = Styled(A)`
  font-size: 8px;
`;
