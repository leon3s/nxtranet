import type {GetServerSidePropsResult} from 'next';
import type {NextRouter} from 'next/router';
import React from 'react';
import {bindActionCreators} from 'redux';
import DashboardHud from '~/containers/DashboardHud';
import DashboardProjects from '~/containers/DashboardProjects';
import ModalConfirm from '~/containers/ModalConfirm';
import ModalForm from '~/containers/ModalForm';
import type {State} from '~/redux/reducers';
import {wrapper} from '~/redux/store';
import type {Dispatch} from '~/utils/redux';

const actions = {};

const mapStateToprops = () => ({});

const mapDispatchToProps = (dispatch: Dispatch<State>) =>
  bindActionCreators(actions, dispatch);

type ProjectsPageProps = {
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

class ProjectsPage extends
  React.PureComponent<ProjectsPageProps> {
  static getLayout = (page: React.ReactElement) => {
    return (
      <React.Fragment>
        <ModalConfirm />
        <ModalForm />
        <DashboardHud>
          {page}
        </DashboardHud>
      </React.Fragment>
    );
  };

  render() {
    return (
      <DashboardProjects />
    );
  }
}

export default ProjectsPage;
