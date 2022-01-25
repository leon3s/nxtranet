import Styled from 'styled-components';

import Image from '~/components/Shared/Image';

import * as GlobalStyle from '~/styles/global';

export const FixedContainer = Styled.div`
  top: 0;
  width: 100%;
  height: 80px;
  min-height: 80px; 
  max-height: 80px;
`;

export const Container = Styled(GlobalStyle.Container)`
  display: flex;
  flex: 1;
  height: 100%;
  width: 100%;
  z-index: 100;
  flex-direction: row;
  position: relative;
  align-items: center;
  justify-content: space-between;
`;

export const UserAvatar = Styled(Image)`
  border-radius: 15px;
`;

export const SubMenu = Styled.div`
`;

export const SubMenuNav = Styled.div`
  height: 48px;
  width: 100%;
  padding: 2px 0px;
  position: relative;
  overflow: hidden;
`;

interface StickyProps {
  sticky: boolean;
}

export const Sticky = Styled.div<StickyProps>`
  width:100%;
${props => `
  ${props.sticky ? `
    top: 0px;
    left: 0px;
    position: fixed;
    z-index: 100;
` : ``}
`}
`;

export const MenuContainer = Styled.div`
  position:relative;
  width:100%;
  padding: 0px 8px;
  ${props => `
  box-shadow: ${props.theme.boxShadowSmooth};
  background-color: ${props.theme.primaryBackground};
`}`;

export const MenuContent = Styled(GlobalStyle.Container)`
  position:relative;
  width:100%;
  position:relative;
  display: flex;
  height: 48px;
  transition: transform .25s ease;
  flex: 1;
  flex-grow: 1;
  width: 100%;
  align-items: center;
`;

export const LogoAnim = Styled.img`
  cursor: pointer;
  width: 20px;
  margin-top: auto;
  margin-bottom: auto;
  opacity: 0;
  transform: translate3d(0,-20px,0);
  transition: all .25s ease;
  visibility: hidden;
`;

export const Limiter = Styled.div`
  width:0px;
  height:0px;
`;

export const AnimLogo = Styled.div<StickyProps>`
  transition: all .25s ease;
  cursor: pointer;
  width: 30px;
  height: 30px;
  margin-top: auto;
  margin-bottom: auto;
  opacity: 0;
  transform: translate3d(0, -20px, 0);
  transition: all .25s ease;
  visibility: hidden;
${props => `
${props.sticky ? `
  opacity: 1;
  margin-right: 20px;
  visibility: visible;
  transform: translateZ(0);
` : ``}
`}`;

export const MenuNav = Styled.div<StickyProps>`
  transform: translate3d(-30px, 0, 0);
  transition: transform .25s ease;
${props => `
${props.sticky ? `
  transform: translate3d(0, 0, 0);
`: ``}
`}`;

interface NavItemProps {
  active:boolean;
}

export const NavItem = Styled.a<NavItemProps>`
  font-size: 14px;
  font-weight: 400;
  user-select: none;
  transition: all .25s ease;
  padding: 12px 0px;
  text-align: left;
  cursor: pointer;
  z-index: 100;
  margin-right: 20px;
  color: #696969;
  transition: color .2s;
  :hover {
    color: #000;
  }
${props => `
${props.active ? `
  color: #FD4D2B;
  font-weight: 500;
  border-bottom: 2px solid #FD4D2B;
  :hover {
    color: #696969;
    border-bottom: 2px solid #696969;
  }
}` : ``}`}`;
