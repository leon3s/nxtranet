import type {GetServerSidePropsResult} from 'next';
import type {NextRouter} from 'next/router';
import React from 'react';
import {bindActionCreators} from 'redux';
import DashboardHud from '~/containers/DashboardHud';
import DashboardProject from '~/containers/DashboardProject';
import ModalConfirm from '~/containers/ModalConfirm';
import ModalForm from '~/containers/ModalForm';
import {getProjectByName} from '~/redux/actions/project';
import type {State} from '~/redux/reducers';
import {wrapper} from '~/redux/store';
import type {Dispatch} from '~/utils/redux';

const actions = {};

const mapStateToprops = () => ({
});

const mapDispatchToProps = (dispatch: Dispatch<State>) =>
  bindActionCreators(actions, dispatch);

type ProjectPageProps = {
  projectName: string;
  tab: string;
  router: NextRouter;
} & ReturnType<typeof mapStateToprops>
& ReturnType<typeof mapDispatchToProps>

export const getServerSideProps = wrapper.getServerSideProps((store) =>
  async (ctx): Promise<GetServerSidePropsResult<any>> => {
    const [projectName, tab] = ctx.query.all || [];
    try {
      await store.dispatch(getProjectByName(projectName));
    } catch (e) {
      console.error(e);
      return {
        redirect: {
          permanent: false,
          destination: `/dashboard/projects`,
        }
      };
    }
    if (!tab) {
      return {
        redirect: {
          permanent: false,
          destination: `/dashboard/projects/${projectName}/clusters`,
        },
      };
    }
    // ctx.req.all
    return {
      props: {
        tab: tab,
        projectName: projectName,
      },
    };
  }
);

class ProjectPage extends
  React.PureComponent<ProjectPageProps> {
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
    const {
      projectName,
      tab,
    } = this.props;
    return (
      <DashboardProject
        tab={tab}
        projectName={projectName}
      />
    );
  }
}

export default ProjectPage;
