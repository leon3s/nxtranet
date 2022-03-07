import Styled from 'styled-components';
import Text from './Text';

export const ProjectCardIcon = Styled.div`
  ${props => `
    color: ${props.theme.text.color.secondary};
  `}
`;

export const ProjectCardContainer = Styled.a`
  display: flex;
  padding: 6px;
  position: relative;
  flex-direction: row;
  cursor: pointer;
  overflow: hidden;
  background-color: white;
  transition: all .4;
  min-width: calc((100% / 4) - 6px);
  box-sizing: border-box;
  @media (max-width: 1024px) {
    min-width: calc((100% / 2) - 4px);
  }
  @media (max-width: 900px) {
    min-width: calc(100%);
  }
  ${props => `
    border-radius: ${props.theme.borderRadius};
    box-shadow: ${props.theme.boxShadowAdvenced};
    :hover {
      background-color: ${props.theme.view.background.hover};
    }
  `}
`;

export const ProjectCardTitleContainer = Styled.div`
`;

export const ProjectCardDescription = Styled.div`
`;

export const ProjectCardSubtitle = Styled(Text)`
  font-size: 8px;
`;

export const ProjectCardTitle = Styled(Text)`
  margin: 0px;
  font-size: 10px;
`;
