import type {GetServerSidePropsResult} from 'next';
import Error from 'next/error';
import Head from 'next/head';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import DashboardHeader from '~/components/Dashboard/Header';
import Nginx from '~/components/Dashboard/Nginx';
import {nginxActions} from '~/redux/actions';
import type {State} from '~/redux/reducers';
import {wrapper} from '~/redux/store';
import type {Dispatch} from '~/utils/redux';

const actions = {
}

const mapStateToProps = (state: State) => ({
  sitesAvaible: state.nginx.data,
});

const mapDispatchToProps = (dispatch: Dispatch<State>) =>
  bindActionCreators(actions, dispatch);

type NginxPageProps = {
  statusCode?: number;
}
  & ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>;

export const getServerSideProps = wrapper.getServerSideProps(store =>
  async ({ }): Promise<GetServerSidePropsResult<any>> => {
    let statusCode = 0;
    try {
      await store.dispatch(nginxActions.getSitesAvaible());
    } catch (e: any) {
      statusCode = e?.response?.statusCode || 500;
    }
    return {
      props: {
        statusCode,
      },
    }
  }
)

function NginxPage(props: NginxPageProps) {
  const {statusCode} = props;
  return (
    <React.Fragment>
      <Head>
        <title>Nginx - Dashboard - Nextranet</title>
      </Head>
      <DashboardHeader />
      {statusCode ?
        <Error statusCode={statusCode} />
        : <Nginx
          data={props.sitesAvaible}
        />}
    </React.Fragment>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(NginxPage);
