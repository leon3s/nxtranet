import React from 'react';
import Head from 'next/head';
import { connect } from 'react-redux';

import DashboardHeader from '~/components/Dashboard/Header';
import Dashboard from '~/components/Dashboard/Home';

import { bindActionCreators } from 'redux';
import { GetServerSidePropsResult } from 'next';

import { wrapper } from '~/redux/store';
import { meActions } from '~/redux/actions';

export const getServerSideProps = wrapper.getServerSideProps(store =>
  async (ctx): Promise<GetServerSidePropsResult<any>> => {
    store;
    ctx;
    // const state = store.getState();
    // if (state.me.errors.whoiam) {
    //   ctx.res.writeHead(301, { Location: '/' });
    //   ctx.res.end();
    // }
    return {
      props: {},
    }
  }
)

function DashboardPage() {
  return (
    <React.Fragment>
      <Head>
        <title>Dashboard - Docktron</title>
      </Head>
      <DashboardHeader />
      <Dashboard />
    </React.Fragment>
  )
}

export default connect(() => ({
}), (dispatch) =>
  bindActionCreators({
    login: meActions.login,
  }, dispatch)
)(DashboardPage);

