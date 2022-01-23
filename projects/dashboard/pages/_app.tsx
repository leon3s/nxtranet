import type {AppInitialProps} from 'next/app';
import App from 'next/app';
import Head from 'next/head';
import React from 'react';
import {ThemeProvider} from 'styled-components';
import {wrapper} from '~/redux/store';
import {themeDefault} from '~/styles/themes';



class MyApp extends App<AppInitialProps> {
  public static getInitialProps = wrapper.getInitialAppProps((store) => async () => {
    try {
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
            <title>Docktron</title>
            <link rel="shortcut icon" href="/images/icon.ico" type="image/x-icon" />
            <meta name="viewport" content="width=device-width, user-scalable=no" />
            <script async src="https://www.googletagmanager.com/gtag/js?id=UA-64766741-2"></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'UA-64766741-2');
                `}
              }
            />

          </Head>
          <Component {...pageProps} />
        </React.Fragment>
      </ThemeProvider>
    );
  }
}

export default wrapper.withRedux(MyApp);
