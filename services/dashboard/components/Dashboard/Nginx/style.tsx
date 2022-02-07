import Styled from 'styled-components';
import { ButtonDefault } from '~/styles/buttons';

import * as GlobalStyle from '~/styles/global';

export const Container = Styled(GlobalStyle.Container)`
  width: 100%;
  height: 100%;
`;

export const NginxCards = Styled.div`
  width: 100%;
  flex: 1;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 18px;
`;

export const NginxCardContainer = Styled.div`
  margin-bottom: 12px;
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

export const NginxCardActionButton = Styled(ButtonDefault)<NginxCardActionButtonProps>`
  min-width: 25px;
  height: 25px;
  width: 25px;
  border-radius: 25px;
  padding: 0px;
${props => `
  ${typeof props.isActive !== 'undefined' ? isNginxCardActive(props.isActive) : '' }
`}`;
