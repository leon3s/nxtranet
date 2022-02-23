import {GetServerSidePropsResult} from 'next';
import Error from 'next/error';
import Head from 'next/head';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import DashboardHeader from '~/components/Dashboard/Header';
import Dashboard from '~/components/Dashboard/Home';
import {homeActions} from '~/redux/actions';
import {wrapper} from '~/redux/store';

type DasboardProps = {
  statusCode?: number;
}

export const getServerSideProps = wrapper.getServerSideProps(store =>
  async ({ }): Promise<GetServerSidePropsResult<any>> => {
    // const state = store.getState();
    // if (state.me.errors.whoiam) {
    //   ctx.res.writeHead(301, { Location: '/' });
    //   ctx.res.end();
    // }
    try {
      await store.dispatch(homeActions.getUptime());
      await store.dispatch(homeActions.getNetworkInterfaces());
      await store.dispatch(homeActions.getAverageResponseTime());
      await store.dispatch(homeActions.getMetrixNginxReq());
      await store.dispatch(homeActions.getMetrixClusterProduction());
      await store.dispatch(homeActions.getMetrixContainerRunning());
      await store.dispatch(homeActions.getMetrixNginxDomains());
      await store.dispatch(homeActions.getMetrixNginxStatus());
    } catch (e: any) {
      console.error(e);
      return {
        props: {
          statusCode: e?.response?.statusCode || 500,
        }
      }
    }

    return {
      props: {},
    }
  }
)

function DashboardPage(props: DasboardProps) {
  const {statusCode} = props;
  return (
    <React.Fragment>
      <Head>
        <title>Dashboard - Docktron</title>
      </Head>
      <DashboardHeader />
      {
        statusCode ? <Error statusCode={statusCode} /> :
          <Dashboard />
      }
    </React.Fragment>
  )
}

export default connect(() => ({
}), (dispatch) =>
  bindActionCreators({
  }, dispatch)
)(DashboardPage);

