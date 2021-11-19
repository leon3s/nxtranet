import Styled from 'styled-components';

import {
  ButtonDefault,
  ButtonCancelDefault,
} from '~/styles/buttons';

export const Container = Styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

export const Title = Styled.h4`
  text-align: center;
  margin: 10px 0px 0px 0px;
${props => `
  color: ${props.theme.text.primary};
`}`;

export const Description = Styled.p`
  text-align: center;
  font-size: 12px;
  padding: 10px 0px;
${props => `
  color: ${props.theme.text.secondary};
`}`;

export const ButtonContainer = Styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const SpinnerContainer = Styled.div`
  display: flex;
  width: 40px;
  justify-content: center;
  align-items: center;
  padding-bottom: 10px;
  padding-right: 10px;
`;

export const Button = Styled(ButtonDefault)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ButtonCancel = Styled(ButtonCancelDefault)`
`;
