import type {GetServerSidePropsResult} from 'next';
import type {NextRouter} from 'next/router';
import React from 'react';
import {bindActionCreators} from 'redux';
import DashboardHud from '~/containers/DashboardHud';
import DashboardOverview from '~/containers/DashboardOverview';
import ModalForm from '~/containers/ModalForm';
import { getNetworkInterfaces, getNginxArt, getNginxDomainsReqCount, getNginxReqCount, getNginxReqStatus, getUptime } from '~/redux/actions/overview';
import type {State} from '~/redux/reducers';
import {wrapper} from '~/redux/store';
import type {Dispatch} from '~/utils/redux';

const actions = {};

const mapStateToprops = (state: State) => ({

});

const mapDispatchToProps = (dispatch: Dispatch<State>) =>
  bindActionCreators(actions, dispatch);

type DashboardHomePageProps = {
  router: NextRouter;
} & ReturnType<typeof mapStateToprops>
& ReturnType<typeof mapDispatchToProps>

export const getServerSideProps = wrapper.getServerSideProps((store) =>
  async ({}): Promise<GetServerSidePropsResult<any>> => {
    await store.dispatch(getUptime());
    await store.dispatch(getNginxArt());
    await store.dispatch(getNginxReqCount());
    await store.dispatch(getNetworkInterfaces());
    await store.dispatch(getNginxDomainsReqCount());
    await store.dispatch(getNginxReqStatus());
    return {
      props: {},
    };
  }
);

class DashboardHomePage extends
  React.PureComponent<DashboardHomePageProps> {
  static getLayout = (page: React.ReactElement) => {
    return (
      <React.Fragment>
        <ModalForm />
        <DashboardHud>
          {page}
        </DashboardHud>
      </React.Fragment>
    );
  };

  render() {
    return (
      <DashboardOverview />
    );
  }
}

export default DashboardHomePage;
