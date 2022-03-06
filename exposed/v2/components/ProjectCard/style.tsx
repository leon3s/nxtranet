import Styled, {keyframes} from 'styled-components';

import Text from '../Text';

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
      background-color: rgba(224, 255, 255, 0.6) !important;
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

export const Overlay = Styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 1;
  width: 100%;
  height: 100%;
  backdrop-filter: saturate(180%) blur(2px);
`;

const lineAnimation = keyframes`
 0% { height: 100px; width: 0px; opacity: 0.6 }
 50% { height: 100px; width: 100%; opacity: 0 }
`;

export const AnimatedLine = Styled.div`
  z-index: 2;
  position: absolute;
  height: 100%;
  animation-name: ${lineAnimation};
  animation-duration: 2s;
  animation-iteration-count: infinite;
  ${props => `
    background-color: ${props.theme.view.background.loading};
  `}
  backdrop-filter: saturate(180%) blur(2px);
  border-right: 1px solid hsla(0, 0%, 100%, 0.8);
`;
