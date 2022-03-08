import Styled from 'styled-components';
import ButtonDefault from './Button';

export const Container = Styled.div`
  height: 20px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
`;

export const Buttons = Styled.div`
  width: fit-content;
  display: inline-flex;
  flex: 1;
  flex-wrap: wrap;
  gap: 4px;
`;

export const Button = Styled(ButtonDefault)`
  min-width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px;
  height: 20px;
  margin: 0px;
`;
