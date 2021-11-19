import Styled from 'styled-components';
import { ButtonCancelDefault, ButtonDefault } from '~/styles/buttons';

export const Container = Styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const Actions = Styled.div`
  display: flex;
  margin: 18px 0px;
  flex-direction: column;
  background-color: black;
  height: 100%;
  padding: 4px;
  border-radius: 8px;
`;

export const Action = Styled.div`
  display: flex;
  flex-direction: column;
  margin: 4px 0px;
${props => `
  border-bottom: 1px solid ${props.theme.borderColorDefault};
`}`;

export const ActionHeader = Styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

export const ActionTitle = Styled.p`
  font-size: 12px;
  color: white;
  margin: 0px;
  &:before {
    content: "$> ";
  }
`;

type ActionStatusTitleProps = {
  isPassed: boolean;
}

export const ActionStatusTitle = Styled.p<ActionStatusTitleProps>`
  background-color: white;
  border-radius: 25px;
  font-size: 8px;
  padding: 2px 12px;
  min-width: 42px;
  min-height: 10px;
  text-align: center;
  margin: 0px;
${props => `
  box-shadow: ${props.theme.boxShadowDefault};
${props.isPassed ? `
  color: green;
`: `
  color: red;
`}
`}`;

export const ActionStatus = Styled.div`
`;

export const StatusError = Styled.code`
  font-size: 12px;
  color: red;
  margin: 0px;
  letter-spacing: 1px;
  margin-left: 18px;
`;

type ButtonsProps = {
  isCenter: boolean;
}

export const Buttons = Styled.div<ButtonsProps>`
  display: flex;
  width: 100%;
  transition: all .4s ease;
${props => `
  ${props.isCenter ? `
    justify-content: center;
    align-items: center;
  ` : `
      justify-content: space-between;
  `}
`}`;

type CancelProps = {
  isVisible: boolean;
}

export const Cancel = Styled(ButtonCancelDefault)<CancelProps>`
  transition: transform .2s, min-width .2s;
${props => `
  ${props.isVisible ? `
    opacity: 1;
    transform: scaleX(1);
    ` : `
    min-width: 0px;
    width: 0px;
    height: 0px;
    opacity: 0;
    transform: scaleX(0);
    cursor: default;
  `}
`}
`;

export const Confirm = Styled(ButtonDefault)`
`;
