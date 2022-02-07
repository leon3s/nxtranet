import React, {FormEvent} from 'react';
import Footer from '~/components/Shared/FooterDefault';
import * as Style from './style';

export interface LoginProps {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function Login(props: LoginProps) {
  return (
    <Style.Container>
      <Style.LoginContainer>
        <Style.LoginTitle>
          Log in to nxtranet
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
