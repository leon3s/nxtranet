import React, { FormEvent } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Header from '~/components/Landing/Header';
import Login from '~/components/Landing/Login';

import { wrapper } from '~/redux/store';
import { meActions } from '~/redux/actions';

import type { GetServerSidePropsResult } from 'next';
import type { Dispatch } from '~/utils/redux';
import type { State } from '~/redux/reducers';

const actions = {
  login: meActions.login,
}

const mapStateToprops = () => ({
});

const mapDispatchToProps = (dispatch: Dispatch<State>) =>
  bindActionCreators(actions, dispatch);

type LoginPageProps = {
}
& ReturnType<typeof mapStateToprops>
& ReturnType<typeof mapDispatchToProps>

export const getServerSideProps = wrapper.getServerSideProps(store =>
  async (ctx): Promise<GetServerSidePropsResult<any>> => {
    const state = store.getState();
    if (state.me.me) {
      ctx.res.writeHead(301, { Location: '/dashboard' });
      ctx.res.end();
    }
    return {
      props: {},
    }
  }
)

function IndexPage(props:LoginPageProps) {
  const router = useRouter();
  async function login(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // @ts-ignore
    const email = e.target[0].value;
    // @ts-ignore
    const password = e.target[1].value;
    await props.login({
      email,
      password,
    });
    await router.push('/dashboard');
  }

  return (
    <React.Fragment>
      <Head>
        <title>Login - Nextranet</title>
      </Head>
      <Header />
      <Login
        onSubmit={login}
      />
    </React.Fragment>
  )
}

export default connect(mapStateToprops, mapDispatchToProps)(IndexPage);
