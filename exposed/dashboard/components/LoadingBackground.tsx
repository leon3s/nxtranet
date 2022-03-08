import React from 'react';
import Styled, {keyframes} from 'styled-components';

const Overlay = Styled.div`
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

const AnimatedLine = Styled.div`
  z-index: 2;
  position: absolute;
  height: 100%;
  min-height: 100%;
  animation-name: ${lineAnimation};
  animation-duration: 1.5s;
  animation-iteration-count: infinite;
  ${props => `
    background-color: ${props.theme.view.background.loading};
  `}
  backdrop-filter: saturate(180%) blur(2px);
  border-right: 1px solid hsla(0, 0%, 100%, 0.8);
`;

export type LoadingBackgroundProps = {
}

function LoadingBackground() {
  return (
    <Overlay>
      <AnimatedLine />
    </Overlay>
  );
}

export default LoadingBackground;
