import Styled from 'styled-components';

import { ButtonDefault } from '~/styles/buttons';

export const Container = Styled.div`
  height: 20px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
`;

export const Buttons = Styled.div`
  width: fit-content;
  display: flex;
  flex-direction: row;
`;

export const Button = Styled(ButtonDefault)`
  min-width: 20px;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px;
  height: 20px;
`;
