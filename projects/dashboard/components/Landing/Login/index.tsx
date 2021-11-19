/*
 * Filename: c:\Users\leone\Documents\code\nextranet\dashboard\components\Landing\Login\index.tsx
 * Path: c:\Users\leone\Documents\code\docktron\org
 * Created Date: Tuesday, October 26th 2021, 11:31:37 am
 * Author: leone
 * 
 * Copyright (c) 2021 docktron
 */

import React, { FormEvent } from 'react';
import Footer from '~/components/Shared/FooterDefault';

import * as Style from './style';

export interface LoginProps {
  onSubmit: (e:FormEvent<HTMLFormElement>) => void;
}

export default function Login(props:LoginProps) {
  return (
    <Style.Container>
      <Style.LoginContainer>
        <Style.LoginTitle>
          Log in to nextranet
        </Style.LoginTitle>
        <Style.LoginForm onSubmit={props.onSubmit}>
          <Style.InputContainer>
            <Style.EmailInput
              placeholder="Email Address"
              />
          </Style.InputContainer>
          <Style.InputContainer>
            <Style.PasswordInput
              placeholder="Password"
            />
          </Style.InputContainer>
          <Style.LoginButton
            value="Login"
          />
        </Style.LoginForm>
      </Style.LoginContainer>
      <Footer />
    </Style.Container>
  )
}
