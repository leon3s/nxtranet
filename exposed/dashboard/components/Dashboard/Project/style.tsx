import Styled from 'styled-components';
import * as GlobalStyle from '~/styles/global';
import * as NavStyle from '~/styles/nav';

export const Container = Styled(GlobalStyle.Container)`
  width: 100%;
  display: flex;
  flex: 1;
  flex-direction column;
  min-height: 100%;
`;

export const ProjectWrap = Styled.div`
  height: 100%;
  padding-top: 8px;
`;

export const MobileSettings = Styled.div`
  position: relative;
  width: 100%;
`;

type MobileNavContainerProps = {
  isVisible?: boolean;
}

export const MobileNavContainer = Styled.div<MobileNavContainerProps>`
  transition: all .5s ease;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  ${props => `
    ${props.isVisible ? `
      max-height: 500px;
    ` : `
      max-height: 0px;
    `}

  `}
`;

export const DesktopNavTitle = Styled(NavStyle.NavTabTitle)`
  border-top: 0;
  border-left: 0;
  border-right: 0;
  margin-right: 8px;
  display: flex;
  align-items: center;
`;

export const MobileSettingAbs = Styled.div`
  position: absolute;
  right: 0px;
  display: flex;
  flex-direction: column;
`;

export const MobileSettingContainer = Styled(NavStyle.NavTabTitle)`
  display: flex;
  padding: 4px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 100%;
  margin-top: 4px;
  ${props => `
    color: ${props.theme.orange} !important;
    background-color: white;
    box-shadow: ${props.theme.boxShadowDefault};
  `}
`;
