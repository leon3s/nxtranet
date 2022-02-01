import {GetServerSidePropsResult} from 'next';
import Head from 'next/head';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import DashboardHeader from '~/components/Dashboard/Header';
import Dashboard from '~/components/Dashboard/Home';
import {homeActions} from '~/redux/actions';
import {wrapper} from '~/redux/store';


export const getServerSideProps = wrapper.getServerSideProps(store =>
  async ({ }): Promise<GetServerSidePropsResult<any>> => {
    // const state = store.getState();
    // if (state.me.errors.whoiam) {
    //   ctx.res.writeHead(301, { Location: '/' });
    //   ctx.res.end();
    // }
    await store.dispatch(homeActions.getUptime());
    await store.dispatch(homeActions.getNetworkInterfaces());
    await store.dispatch(homeActions.getAverageResponseTime());
    await store.dispatch(homeActions.getMetrixNginxReq());
    await store.dispatch(homeActions.getMetrixClusterProduction());
    await store.dispatch(homeActions.getMetrixContainerRunning());
    await store.dispatch(homeActions.getMetrixNginxDomains());
    await store.dispatch(homeActions.getMetrixNginxStatus());
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
  }, dispatch)
)(DashboardPage);

