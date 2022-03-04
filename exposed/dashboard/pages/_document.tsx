import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript
} from 'next/document';
import {ServerStyleSheet} from 'styled-components';

const staticCss = `
#__next {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: transparent;
  }
  html, body {
    background: transparent;
    margin: 0px;
    min-height: 100%;
    height: 100%;
    max-height: 100%;
  }
  body {
    overflow: visible;
    overflow-y: auto;
  }
`;

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
            <link href="/styles/index.css" rel="stylesheet" />
            <style dangerouslySetInnerHTML={{__html: staticCss}} />
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html lang="en" >
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
