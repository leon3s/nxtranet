/*
 * Filename: c:\Users\leone\Documents\code\nextranet\dashboard\components\Shared\ReTable\style.tsx
 * Path: c:\Users\leone\Documents\code\docktron\org
 * Created Date: Tuesday, October 26th 2021, 5:09:36 pm
 * Author: leone
 * 
 * Copyright (c) 2021 docktron
 */

import Styled from 'styled-components';

export const Container = Styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
`;

export const Content = Styled.div`
  display: flex;
  max-width: 100%;
  flex-direction: column;
  overflow: hidden;
${props => `
  border-radius: ${props.theme.borderRadius}px;
`}`;

export const Line = Styled.div`
  display: flex;
  height: 48px;
  flex-direction: row;
  align-items: center;
  font-size: 10px;
  font-weigth: 400;
  :last-child {
    border: 0;
  }
${props => `
  border-bottom: 1px solid ${props.theme.borderColorDefault};
  color: ${props.theme.text.secondary};
  :first-child {
    color: ${props.theme.text.primary};
    background-image: ${props.theme.backgroundGradient};
  }
`}`;

interface CellProps {
  schemaLength:number;
}

export const Cell = Styled.div<CellProps>`
${props => `
  padding: ${props.theme.padding.light}px;
  width: calc(100% / ${props.schemaLength});
`}`;

interface ActionCellProps {
  isHidden?: boolean;
  actionsLength?: number;
}

export const ActionList = Styled.div`
  height: 30px;
  width: fit-content;
  background-color: white;
  transition: transform .25s ease;
  border-radius: 15px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0px;
${props => `
  border: 1px solid ${props.theme.borderColorDefault};
`}`;

interface ActionItemProps {
  isEnabled?: boolean;
};

export const ActionItem = Styled.div<ActionItemProps>`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
${props => `
${props.isEnabled ? `
  :hover {
    transform: scale(1.2);
  }
` : ``}
`}`;

export const ActionCell = Styled.div<ActionCellProps>`
  width: 30px;
  height: 30px;
  position: relative;
${props => `
  :hover > ${ActionList} {
    opacity: 1;
    visibility: visible;
    transform: translate3d(-${((props.actionsLength || 0) * 30) + 2}px, 0, 0);
  }
${props.isHidden ? `
  visibility: hidden;
` : ``}
`}`;

export const HeaderContainer = Styled.div`
${props => `
  padding: ${props.theme.padding.light}px;
`}`;