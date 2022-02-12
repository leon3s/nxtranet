import Styled from 'styled-components';
import * as GlobalStyle from '~/styles/global';

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
