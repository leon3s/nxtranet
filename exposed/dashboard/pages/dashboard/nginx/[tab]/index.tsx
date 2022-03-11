import type {GetServerSidePropsResult} from 'next';
import type {NextRouter} from 'next/router';
import React from 'react';
import {bindActionCreators} from 'redux';
import DashboardHud from '~/containers/DashboardHud';
import DashboardNginx from '~/containers/DashboardNginx';
import ModalForm from '~/containers/ModalForm';
import {getNginxSitesAvailable} from '~/redux/actions/nginx';
import type {State} from '~/redux/reducers';
import {wrapper} from '~/redux/store';
import type {Dispatch} from '~/utils/redux';

const actions = {};

const mapStateToprops = ({ }: State) => ({
});

const mapDispatchToProps = (dispatch: Dispatch<State>) =>
  bindActionCreators(actions, dispatch);

type DashboardNginxPageProps = {
  tab: string;
  router: NextRouter;
} & ReturnType<typeof mapStateToprops>
  & ReturnType<typeof mapDispatchToProps>

export const getServerSideProps = wrapper.getServerSideProps((store) =>
  async (ctx): Promise<GetServerSidePropsResult<any>> => {
    const tab = ctx.query.tab;
    await store.dispatch(getNginxSitesAvailable());
    return {
      props: {
        tab,
      },
    };
  }
);

class DashboardNginxPage extends
  React.PureComponent<DashboardNginxPageProps> {
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
    const {tab} = this.props;
    return (
      <DashboardNginx
        tab={tab}
      />
    );
  }
}

export default DashboardNginxPage;
