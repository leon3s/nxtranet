import Styled from 'styled-components';
import Button from './Button';

export const Container = Styled.div`
  display: flex;
  flex-direction: column;
`;

export const Line = Styled.div`
  margin-top: 8px;
  display: inline-flex;
  height: 50px;
  gap: 8px;
  overflow-x: scroll;
`;

export const Cancel = Styled(Button)`
  width: 100%;
`;
