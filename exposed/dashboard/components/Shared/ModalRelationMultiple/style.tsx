import Styled from 'styled-components';
import {ButtonCancelDefault} from '~/styles/buttons';
import {Title} from '~/styles/text';

export const Container = Styled.div`
  display: flex;
  flex-direction: column;
`;

export const ModalTitle = Styled(Title)`
  margin-left: 4px;
  font-weight: bold;
`;

export const ModalTitleContainer = Styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Line = Styled.div`
  display: inline-flex;
  height: 50px;
  gap: 8px;
  overflow-x: scroll;
`;

export const Cancel = Styled(ButtonCancelDefault)`
  margin-top: 8px;
  width: 100%;
`;
