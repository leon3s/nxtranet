import type {NextPage} from 'next';
import type {AppProps} from 'next/app';
import App from 'next/app';
import Head from 'next/head';
import React from 'react';
import {ThemeProvider} from 'styled-components';
import {wrapper} from '~/redux/store';
import {themeDefault} from '~/styles/themes';
import '../public/styles/index.css';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

class MyApp extends App<AppPropsWithLayout> {
  public static getInitialProps = wrapper.getInitialAppProps(({}) => async (appCtx) => {
    try {
      if (appCtx.ctx?.res?.statusCode === 404) {
        appCtx.ctx.res.writeHead(302, {Location: '/'});
        appCtx.ctx.res.end();
        return {
          pageProps: {},
        };
      }
    } catch (e) { }
    return {
      pageProps: {},
    };
  });

  public render() {
    const {Component, pageProps} = this.props;
    const getLayout = Component.getLayout ?? ((page) => page);
    return (
      <ThemeProvider theme={themeDefault}>
        <React.Fragment>
          <Head>
            <title>nxtranet</title>
            <link rel="shortcut icon" href="/images/icon.ico" type="image/x-icon" />
            <meta name="viewport" content="width=device-width, user-scalable=no" />
          </Head>
          {getLayout(<Component {...pageProps} />)}
        </React.Fragment>
      </ThemeProvider>
    );
  }
}

export default wrapper.withRedux(MyApp);
