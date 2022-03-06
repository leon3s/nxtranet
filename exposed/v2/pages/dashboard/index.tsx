import type {GetServerSidePropsResult} from 'next';
import type {NextRouter} from 'next/router';
import React from 'react';
import {bindActionCreators} from 'redux';
import DashboardHeader from '~/containers/DashboardHeader';
import DashboardHud from '~/containers/DashboardHud';
import Home from '~/containers/Home';
import ModalForm from '~/containers/ModalForm';
import type {State} from '~/redux/reducers';
import {wrapper} from '~/redux/store';
import type {Dispatch} from '~/utils/redux';

const actions = {};

const mapStateToprops = () => ({
});

const mapDispatchToProps = (dispatch: Dispatch<State>) =>
  bindActionCreators(actions, dispatch);

type DashboardHomePageProps = {
  router: NextRouter;
} & ReturnType<typeof mapStateToprops>
& ReturnType<typeof mapDispatchToProps>

export const getServerSideProps = wrapper.getServerSideProps(({}) =>
  async ({}): Promise<GetServerSidePropsResult<any>> => {
    return {
      props: {},
    };
  }
);

class DashboardHomePage extends
  React.PureComponent<DashboardHomePageProps> {
  render() {
    return (
      <React.Fragment>
        <DashboardHeader />
        <ModalForm />
        <DashboardHud>
          <Home />
        </DashboardHud>
      </React.Fragment>
    );
  }
}

export default DashboardHomePage;
