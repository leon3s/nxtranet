/*
 * Filename: c:\Users\leone\Documents\code\nextranet\dashboard\styles\inputs.tsx
 * Path: c:\Users\leone\Documents\code\docktron\org
 * Created Date: Wednesday, October 27th 2021, 3:44:12 pm
 * Author: leone
 * 
 * Copyright (c) 2021 docktron
 */

import Styled from 'styled-components';

export const SearchBar = Styled.input`
  padding: 0px 12px;
  line-height: normal;
  height: 28px;
  width: 100%;
  min-width: 0;
  outline: none;
  font-size: 10px;
  outline: none;
  -webkit-appearance: none;
  transition: border-color .15s ease;
  border: 1px solid rgba(0, 0, 0, 0.2);
${props =>`
  border-radius: ${props.theme.borderRadius}px;
  :focus {
    border-color: ${props.theme.borderColorPrimary};
  }
`}`;

export const Default = Styled.input`
  padding: 0px 12px;
  line-height: normal;
  height: 28px;
  width: 100%;
  min-width: 0;
  outline: none;
  font-size: 10px;
  outline: none;
  -webkit-appearance: none;
  transition: border-color .15s ease;
  border: 1px solid rgba(0, 0, 0, 0.2);
  ${props =>`
  border-radius: ${props.theme.borderRadius}px;
  :focus {
    border-color: ${props.theme.borderColorPrimary};
  }
`}`