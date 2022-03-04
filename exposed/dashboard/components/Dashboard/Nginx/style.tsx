import Styled from 'styled-components';
import {ButtonDefault} from '~/styles/buttons';
import * as GlobalStyle from '~/styles/global';

export const Container = Styled(GlobalStyle.Container)`
  width: 100%;
  display: flex;
  flex: 1;
  flex-direction column;
  min-height: 100%;
  padding-top: 8px;
`;

export const NginxCards = Styled.div`
  width: 100%;
  padding-top: 8px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const NginxCardContainer = Styled.div`
`;

export const CodeEditorWrapper = Styled.div`
  width: 100%;
`;

export const NginxCardContent = Styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

export const NginxCardActionsRelative = Styled.div`
  position: relative;
  width: 100%;
`;

export const NginxCardActions = Styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

export const NginxCardAction = Styled.div`
  z-index: 100;
  margin: 4px;
`;

type NginxCardActionButtonProps = {
  isActive?: boolean;
}

const isNginxCardActive = (isActive: boolean) => isActive ?
  `` : `
  border-color: rgba(0, 0, 0, 0.25);
  background-color: rgba(0, 0, 0, 0.25);
  color: red;
  &:hover {
    border-color: rgba(0, 0, 0, 0.25);
    background-color: rgba(0, 0, 0, 0.25);
    color: red;
  }
`;

export const NginxCardActionButton = Styled(ButtonDefault) <NginxCardActionButtonProps>`
  min-width: 25px;
  height: 25px;
  width: 25px;
  border-radius: 25px;
  padding: 0px;
${props => `
  ${typeof props.isActive !== 'undefined' ? isNginxCardActive(props.isActive) : ''}
`}`;
