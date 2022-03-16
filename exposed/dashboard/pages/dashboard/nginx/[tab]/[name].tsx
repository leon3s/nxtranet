import type {GetServerSidePropsResult} from 'next';
import type {NextRouter} from 'next/router';
import React from 'react';
import {bindActionCreators} from 'redux';
import DashboardHud from '~/containers/DashboardHud';
import DashboardNginx from '~/containers/DashboardNginx';
import ModalForm from '~/containers/ModalForm';
import {getNginxSitesAvailable, setNginxSiteAvaible} from '~/redux/actions/nginx';
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
  name: string;
  router: NextRouter;
} & ReturnType<typeof mapStateToprops>
  & ReturnType<typeof mapDispatchToProps>

export const getServerSideProps = wrapper.getServerSideProps((store) =>
  async (ctx): Promise<GetServerSidePropsResult<any>> => {
    const tab = ctx.query.tab;
    const objName = ctx.query.name;
    const res = await store.dispatch(getNginxSitesAvailable());
    const nginxFile = res.value.data.find(({name}) =>
      name === objName
    );
    if (!nginxFile) {
      return {
        redirect: {
          permanent: false,
          destination: `/dashboard/nginx/files`,
        }
      };
    }
    await store.dispatch(setNginxSiteAvaible(nginxFile));
    return {
      props: {
        tab,
        name: objName,
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
    const {
      tab,
      name,
    } = this.props;
    return (
      <DashboardNginx
        tab={tab}
        name={name}
      />
    );
  }
}

export default DashboardNginxPage;
