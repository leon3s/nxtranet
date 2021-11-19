/*
 * Filename: c:\Users\leone\Documents\code\nextranet\projects\dashboard\styles\project.tsx
 * Path: c:\Users\leone\Documents\code\nextranet\dashboard
 * Created Date: Saturday, October 30th 2021, 5:03:00 pm
 * Author: leone
 * 
 * Copyright (c) 2021 docktron
 */

import Styled from 'styled-components';

export const Line = Styled.div`
  padding: 10px 0px;
  display: flex;
  border-radius: 4px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
${props => `
  border-bottom: 1px solid ${props.theme.borderColorDefault};
`}`;

export const Title = Styled.h4`
  font-size: 14px;
  padding: 0px 8px;
  margin: 10px 0px;
  :first-letter {
    text-transform: uppercase;
  }
`;
