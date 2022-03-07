import type {GetServerSidePropsResult} from 'next';
import type {NextRouter} from 'next/router';
import React from 'react';
import {bindActionCreators} from 'redux';
import DashboardHud from '~/containers/DashboardHud';
import DashboardProject from '~/containers/DashboardProject';
import ModalConfirm from '~/containers/ModalConfirm';
import ModalForm from '~/containers/ModalForm';
import {getProjectByName, getProjectClusterByName, getProjectPipelineByNamespace} from '~/redux/actions/project';
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
  subtab?: string | null;
  router: NextRouter;
} & ReturnType<typeof mapStateToprops>
& ReturnType<typeof mapDispatchToProps>

export const getServerSideProps = wrapper.getServerSideProps((store) =>
  async (ctx): Promise<GetServerSidePropsResult<any>> => {
    const [projectName, tab, subtab] = ctx.query.all || [];
    try {
      await store.dispatch(getProjectByName(projectName));
    } catch (e) {
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
    if (tab === 'clusters' && subtab) {
      await store.dispatch(getProjectClusterByName(projectName, subtab, {}));
    }
    if (tab === 'pipelines' && subtab) {
      await store.dispatch(getProjectPipelineByNamespace(`${projectName}.${subtab}`));
    }
    return {
      props: {
        tab,
        subtab: subtab || null,
        projectName,
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
      tab,
      subtab,
      projectName,
    } = this.props;
    return (
      <DashboardProject
        tab={tab}
        subtab={subtab}
        projectName={projectName}
      />
    );
  }
}

export default ProjectPage;
