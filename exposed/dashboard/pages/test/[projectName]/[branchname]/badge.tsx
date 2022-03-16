import type {GetServerSidePropsResult} from 'next';
import React from 'react';
import {bindActionCreators} from 'redux';
import nodeHtmlToImage from 'node-html-to-image';
import type {State} from '~/redux/reducers';
import {wrapper} from '~/redux/store';
import type {Dispatch} from '~/utils/redux';
import TestBage from '~/components/TestBage';
import {renderToString} from 'react-dom/server';
import {ServerStyleSheet} from 'styled-components';

const actions = {};

const mapStateToprops = ({ }: State) => ({
});

const mapDispatchToProps = (dispatch: Dispatch<State>) =>
  bindActionCreators(actions, dispatch);

type TestPageProps = {
} & ReturnType<typeof mapStateToprops>
  & ReturnType<typeof mapDispatchToProps>

export const getServerSideProps = wrapper.getServerSideProps(({ }) =>
  async (ctx): Promise<GetServerSidePropsResult<any>> => {
    const sheet = new ServerStyleSheet();
    const {res} = ctx;
    const comp = <TestBage type="passing" />;
    const html = renderToString(sheet.collectStyles(comp));
    const styleTags = sheet.getStyleTags();
    const image = await nodeHtmlToImage({
      type: 'png',
      transparent: true,
      html: `
        <html">
          <head>
            <style>
              html, body {
                background: rgba(0, 0, 0, 0) !important;
                width: fit-content;
                height: fit-content;
              }
            </style>
            ${styleTags}
          </head>
          ${html}
        </html>
      `
    });
    res.writeHead(200, {'Content-Type': 'image/png'});
    res.end(image, 'binary');
    return {
      props: {},
    };
  }
);

class TestPage extends
  React.PureComponent<TestPageProps> {
}

export default TestPage;
