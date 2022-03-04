import Styled from 'styled-components';
import * as GlobalStyle from '~/styles/global';
import {A} from '~/styles/link';
import * as NavStyle from '~/styles/nav';
import {Text} from '~/styles/text';

export const Container = Styled(GlobalStyle.Container)`
  width: 100%;
  display: flex;
  flex: 1;
  flex-direction column;
  min-height: 100%;
`;

export const ProjectWrap = Styled.div`
  padding-top: 8px;
  display: flex;
  flex: 1;
  flex-direction: column;
`;

export const NavFeedContainer = Styled.div`
  display: flex;
  flex-direction: row;
`;

export const NavFeedWrapper = Styled.div`
  display: flex;
  align-items: center;
`;

export const NavFeedItem = Styled(A)`
  display: flex;
  margin: 0px;
  font-size: 14px;
`;

export const NavFeedSeparator = Styled(Text)`
  display: flex;
  margin: 0px;
  font-size: 14px;
  font-weight: bold;
`;

export const DesktopNavTitle = Styled(NavStyle.NavTabTitle)`
  border-top: 0;
  border-left: 0;
  border-right: 0;
  margin-right: 8px;
  display: flex;
  align-items: center;
`;
