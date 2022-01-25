/*
 * Filename: c:\Users\leone\Documents\code\docktron\org\styles\release.tsx
 * Path: c:\Users\leone\Documents\code\docktron\org
 * Created Date: Tuesday, October 26th 2021, 6:40:58 am
 * Author: leone
 * 
 * Copyright (c) 2021 docktron
 */

import Styled from 'styled-components';

import * as GlobalStyle from '~/styles/global';

export const ContainerWrapper = Styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
  flex-direction: column;
`;

export const Container = Styled.div`
  flex: 1;
  display: flex;
  flex-direction column;
  min-height: calc(100vh - 80px);
`;

export const TitleContainer = Styled.div`
  padding: 50px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  ${props => `
    background-image: ${props.theme.backgroundGradientInverted};
  `}
`;

export const Title = Styled.h2`
  font-size: 2.5rem;
  ${props =>`
    color: ${props.theme.text.primary};
  `};
`;

export const Description = Styled.h3`
  font-size: 1rem;
  ${props =>`
    color: ${props.theme.text.secondary};
  `};
`;

export const ReleasesContainer = Styled.div`
  height: 100%;
  ${props =>`
    box-shadow: ${props.theme.boxShadowDefault};
    background-image: ${props.theme.backgroundGradient};
  `};
`;

export const ReleaseContainer = Styled(GlobalStyle.Container)`
  padding: 2.5rem 0;
`;

export const ReleaseTitle = Styled.h4`
  margin: 0px;
  font-size: 1.42em;
`;

export const ReleaseDate = Styled.p`
  font-size: 0.8em;
  margin-top: 0.4rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.text.secondary};
`;

export const ReleaseBody = Styled.div`
  margin: 40px 0px;
  * {font-size: 0.8rem !important;}
`;

export const ReleaseLink = Styled.a`
  ${props => `
    color: ${props.theme.link.colorPrimary};
    &:hover {
      color: ${props.theme.link.colorPrimaryHover};
    }
  `}
`;

export const ReleaseLinkReadMore = Styled.a`
  ${props => `
    color: ${props.theme.link.colorPrimary};
  `}
  font-weight: 400;
  text-align:center;
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  background-color: rgba(240, 57, 23, 0.1);
  &:hover {
    background-color: rgba(240, 57, 23, 0.4);
  }
`;
