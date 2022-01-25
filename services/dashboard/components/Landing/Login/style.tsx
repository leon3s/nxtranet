/*
 * Filename: c:\Users\leone\Documents\code\docktron\org\components\Landing\Login\style.tsx
 * Path: c:\Users\leone\Documents\code\docktron\org
 * Created Date: Tuesday, October 26th 2021, 11:31:40 am
 * Author: leone
 * 
 * Copyright (c) 2021 docktron
 */

import Styled from 'styled-components';
import { ButtonSubmitDefault } from '~/styles/buttons';

export const Container = Styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
${props => `
  background-image: ${props.theme.backgroundGradient};
`}`;

export const LoginContainer = Styled.div`
  flex: 1 1;
  align-self: center;
  padding: 24px;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  min-height: calc(100vh - 80px);
  max-width: 900px;
  position: relative;
`;

export const LoginTitle = Styled.h1`
  line-height: 1.5;
  font-size: 3rem;
  hyphens: auto;
  width: 100%;
  text-align: center;
  margin-top: 0;
  margin-bottom: 24px;
  font-weight: 700;
  letter-spacing: -.042222rem;
${props => `
  color: ${props.theme.text.primary};
`}`;

export const LoginForm = Styled.form`
  display: flex;
  height: fit-content;
  flex-direction: column;
  width: 100%;
  display: flex;
  align-items: center;
`;

export const InputContainer = Styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  width: 100%;
  max-width: 100%;
`;

export const GlobalInput = Styled.input`
  border-radius: 4px;
  padding: 0px 12px;
  line-height: normal;
  height: 48px;
  width: 100%;
  min-width: 0;
  outline: none;
  font-size: 1rem;
  outline: none;
  margin-bottom: 
  -webkit-appearance: none;
  transition: border-color .15s ease;
  border: 1px solid rgba(0, 0, 0, 0.2);
  margin-bottom: 8px;
  ${props =>`
    :focus {
      border-color: ${props.theme.borderColorPrimary};
    }
  `}
`;

export const EmailInput = Styled(GlobalInput).attrs(() => ({
  type: 'email',
}))``;

export const PasswordInput = Styled(GlobalInput).attrs(() => ({
  type: 'password',
}))``;

export const LoginButton = ButtonSubmitDefault;
