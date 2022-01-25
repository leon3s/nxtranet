/*
 * Filename: c:\Users\leone\Documents\code\nextranet\projects\dashboard\components\Shared\ReForm\Inputs\style.tsx
 * Path: c:\Users\leone\Documents\code\docktron\org
 * Created Date: Wednesday, October 27th 2021, 5:17:33 pm
 * Author: leone
 * 
 * Copyright (c) 2021 docktron
 */

import Styled from 'styled-components';

export const BaseInput = Styled.input`
  border-radius: 4px;
  padding: 0px 12px;
  line-height: normal;
  height: 28px;
  min-width: 0;
  outline: none;
  font-size: 10px;
  outline: none;
  -webkit-appearance: none;
  transition: border-color .15s ease;
  border: 1px solid rgba(0, 0, 0, 0.2);
${props =>`
:focus {
  border-color: ${props.theme.borderColorPrimary};
}`}`;

export const HiddenFileInput = Styled.input.attrs(() => ({
  type: 'file',
}))`
  display: none;
`;

export const InputIconContainer = Styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

interface         InputIconImgProps {
  backgroundSrc?: string|null;
}

export const InputIconImg = Styled.div<InputIconImgProps>`
  background-color: grey;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  cursor: pointer;
  background-size: cover;
${props => `
${props.backgroundSrc ? `
  background-image: url('${props.backgroundSrc}');
`: ''}
`}`;

export const ArrayStringContainer = Styled.div`
  display: flex;
  flex-direction: column;
`;

export const StringBadgeContainer = Styled.div`
  display: flex;
  flex-direction: row;
`;

export const StringBadge = Styled.p`
  width: fit-content;
  padding: 6px;
  font-size: 10px;
  :first-child {
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
  }
  :last-child {
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
  }
${props => `
  border: 1px solid ${props.theme.borderColorDefault};
`}
`;

export const ArrayStringInput = Styled(BaseInput)`
`;

export const InputColor = Styled.input`
  border-radius: 20px;
  width: 20px;
  border: 0px;
  cursor: pointer;
  margin: 0px;
  padding: 0px;
  height: 20px;
  &::-webkit-color-swatch-wrapper {
    margin: 0px;
    padding: 0px;
    border-radius: 20px;
  }
  &::-webkit-color-swatch {
    margin: 0px;
    padding: 0px;
    border-radius: 20px;
  }
`;

export const InputRelationContainer = Styled.div`
`;

export const InputRelationSelect = Styled.select`
  width: 100%;
  height: 30px;
  font-size: 10px;
  padding: 0px 12px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  outline: none;
${props =>`
:focus {
  border-color: ${props.theme.borderColorPrimary};
}`}`;

export const InputRelationOptions = Styled.option`
  padding: 0px 12px;
  height: 30px;
  font-size: 10px;
  
${props =>`
    border-color: ${props.theme.borderColorPrimary};
`}`;
