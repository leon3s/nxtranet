import Styled from 'styled-components';

import * as GlobalStyle from '~/styles/global';

export const FixedContainer = Styled.div`
  top: 0;
  width: 100%;
  height: 80px;
  z-index: 9000;
  position: fixed;
${props => `
  box-shadow: ${props.theme.boxShadowSmooth};
  backdrop-filter: ${props.theme.header.backdrop};
  background-color: ${props.theme.header.backgroundColor};
`}`;

export const Container = Styled(GlobalStyle.Container)`
  display: flex;
  flex: 1;
  z-index: 9000;
  height: 100%;
  width: 100%;
  z-index: 100;
  flex-direction: row;
  position: relative;
  top: 0px;
  left: 0px;
  align-items: center;
`;

export const Title = Styled.h1`
  margin: 0px;
  padding: 0px;
  line-height: 24px;
  font-size: 18px;
`;

export const NavMenu = Styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

export const NavItem = Styled.div`
`;

interface NavTitleProps {
  active?:boolean;
}

export const NavTitle = Styled.a<NavTitleProps>`
  direction: ltr;
  font-feature-settings: 'kern';
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  font-weight: 500;
  margin-left: 1rem;
  line-height: 1.65;
  opacity: 1;
  font-size: 1rem;
  user-select: none;
  cursor: pointer;
  padding: 0px 10px;
${props => props.active ? `
  color: #FD4D2B;
` : `
  color: #696969;
  :hover {
    color: #000;
    transition: color .4s;
  }
`};`;
