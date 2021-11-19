import React from 'react';
import Head from 'next/head';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { wrapper } from '~/redux/store';
import { nginxActions } from '~/redux/actions';

import Nginx from '~/components/Dashboard/Nginx';
import DashboardHeader from '~/components/Dashboard/Header';

import type { GetServerSidePropsResult } from 'next';
import type { State } from '~/redux/reducers';
import type { Dispatch } from '~/utils/redux';

const actions = {
}

const mapStateToProps = (state: State) => ({
  sitesAvaible: state.nginx.data,
});

const mapDispatchToProps = (dispatch: Dispatch<State>) =>
  bindActionCreators(actions, dispatch);

type NginxPageProps = {
}
& ReturnType<typeof mapStateToProps>
& ReturnType<typeof mapDispatchToProps>;

export const getServerSideProps = wrapper.getServerSideProps(store =>
  async ({}): Promise<GetServerSidePropsResult<any>> => {
    await store.dispatch(nginxActions.getSitesAvaible());
    return {
      props: {},
    }
  }
)

function NginxPage(props: NginxPageProps) {

  return (
    <React.Fragment>
      <Head>
        <title>Nginx - Dashboard - Nextranet</title>
      </Head>
      <DashboardHeader />
      <Nginx
        data={props.sitesAvaible}
      />
    </React.Fragment>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(NginxPage);
