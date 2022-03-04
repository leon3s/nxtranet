import type {AppInitialProps} from 'next/app';
import App from 'next/app';
import Head from 'next/head';
import React from 'react';
import {ThemeProvider} from 'styled-components';
import {wrapper} from '~/redux/store';
import {themeDefault} from '~/styles/themes';

class MyApp extends App<AppInitialProps> {
  public static getInitialProps = wrapper.getInitialAppProps((store) => async (appCtx) => {
    try {
      if (appCtx.ctx?.res?.statusCode === 404) {
        appCtx.ctx.res.writeHead(302, {Location: '/'});
        appCtx.ctx.res.end();
        return {
          pageProps: {},
        };
      }
      const state = store.getState();
      console.log(' ?? ?', state.me.errors.whoiam);
      if (!state.me.me && !state.me.errors.whoiam) {
        // await store.dispatch(meActions.whoiam());
      }
    } catch (e) { }
    return {
      pageProps: {},
    };
  });

  public render() {
    const {Component, pageProps} = this.props;
    return (
      <ThemeProvider theme={themeDefault}>
        <React.Fragment>
          <Head>
            <title>nxtranet</title>
            <link rel="shortcut icon" href="/images/icon.ico" type="image/x-icon" />
            <meta name="viewport" content="width=device-width, user-scalable=no" />
          </Head>
          <Component {...pageProps} />
        </React.Fragment>
      </ThemeProvider>
    );
  }
}

export default wrapper.withRedux(MyApp);
