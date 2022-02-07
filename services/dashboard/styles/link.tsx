/*
 * Filename: c:\Users\leone\Documents\code\nextranet\dashboard\styles\link.tsx
 * Path: c:\Users\leone\Documents\code\nextranet\dashboard
 * Created Date: Sunday, October 31st 2021, 9:21:32 pm
 * Author: leone
 * 
 * Copyright (c) 2021 docktron
 */

import Styled from 'styled-components';


export const A = Styled.a`
  height: fit-content;
  padding: 4px 10px;
  width: fit-content;
  font-weight: 500;
  cursor: pointer;
  transition: all .42s ease;
${props =>`
  border-radius: 4px;
  background-color: ${props.theme.button.primaryBackground};
  color: ${props.theme.button.primaryColor};
  :hover {
    background-color: ${props.theme.button.primaryColor};
    color: ${props.theme.button.primaryBackground};
}`}`;
