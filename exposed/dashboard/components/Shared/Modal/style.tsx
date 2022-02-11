/*
 * Filename: c:\Users\leone\Documents\code\nextranet\dashboard\components\Shared\Modal\style.tsx
 * Path: c:\Users\leone\Documents\code\docktron\org
 * Created Date: Tuesday, October 26th 2021, 8:51:23 pm
 * Author: leone
 * 
 * Copyright (c) 2021 docktron
 */

import Styled from 'styled-components';

type ContainerProps = {
  isVisible: boolean;
}

export const Container = Styled.div<ContainerProps>`
  position: fixed;
  left: 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 100%;
  height: 100%;
  transition: all .4s ease;
${props => `
  backdrop-filter: ${props.theme.header.backdrop};
  ${props.isVisible ? `
  z-index: 99999;
  top: 0px;
  transform: scale(1);
  ` : `
  z-index: -99999;
  top: -2000px;
  transform: scale(0);
  `}
`}`;

export const ContentWrapper = Styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-height: calc(100vh - 180px);
`;

export const Content = Styled.div`
  align-self: center;
  padding: 24px;
  display: flex;
  flex-direction: column;
  max-width: 342px;
  min-height: 142px;
  height: fit-content;
  width: 100%;
  position: relative;
${props => `
  background-image: ${props.theme.backgroundGradient};
  box-shadow: ${props.theme.boxShadowSmooth};
  border-radius: 6px;
  border: 1px solid ${props.theme.borderColorDefault};
`}`;
