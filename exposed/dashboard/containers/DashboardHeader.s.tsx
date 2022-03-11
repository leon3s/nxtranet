import Image from 'next/image';
import Styled from 'styled-components';
import ResponsiveComponent from '~/components/ResponsiveComponent';

export const HeaderContainer = Styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 100px;
  max-height: 100px;
  position: relative;
  ${props => `
    background-color: ${props.theme.view.background.primary};
  `}
`;

export const FixedContainer = Styled.div`
  top: 0;
  display: flex;
  flex: 1;
  flex-direction: column;
  position: relative;
  max-width: 100%;
`;

export const Container = Styled(ResponsiveComponent)`
  display: flex;
  flex: 1;
  height: 50px;
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
  height: 50px;
`;

export const SubMenuNav = Styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
`;

interface StickyProps {
  sticky: boolean;
}

export const Sticky = Styled.div<StickyProps>`
  position: relative;
  top: 0px;
  left: 0px;
  width:100%;
  overflow: hidden;
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
  position: relative;
  width:100%;
  padding: 0px 8px;
  ${props => `
    border-bottom: 1px solid ${props.theme.border.color.default};
    background-color: ${props.theme.view.background.primary};
  `}
`;

export const MenuContent = Styled(ResponsiveComponent)`
  position:relative;
  width:100%;
  position:relative;
  display: flex;
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
  transform: translate3d(0, -20px, 0);
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
  margin-right: 10px;
  visibility: visible;
  transform: translateZ(0);
` : ``}
`}`;

export const MenuNavContainer = Styled.div<StickyProps>`
  position: relative;
  width: 100%;
  max-width: 100%;
  flex: 1;
  align-items: flex-end;
  height: 100%;
  display: flex;
  transform: translate3d(-30px, 0, 0);
  transition: transform .25s ease;
  ${props => `
  ${props.sticky ? `
  @media (max-width: 901px) {
    max-width: calc(100% - 55px);
  }
  transform: translate3d(0, 0, 0);
  `: ``}
  `}`;

  // @media (max-width: 901px) {
  //   top: 6px;
  //   max-width: calc(100% - 12px);
  // }
