import Styled from 'styled-components';

import * as GlobalStyle from '~/styles/global';

export const Container = Styled(GlobalStyle.Container)`
  flex: 1;
  width: 100%;
  display: flex;
  min-height: 100%;
  height: fit-content;
  flex-direction column;
`;

export const FormWrap = Styled.div`
  max-width: 400px;
`;
