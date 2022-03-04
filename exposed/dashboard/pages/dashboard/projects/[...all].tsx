import type {ModelProject} from '@nxtranet/headers';
import type {GetServerSidePropsResult} from 'next';
import Head from 'next/head';
import {useRouter} from 'next/router';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import DashboardHeader from '~/components/Dashboard/Header';
import Project from '~/components/Dashboard/Project';
import ModalConfirm from '~/components/Shared/ModalConfirm';
import {projectActions} from '~/redux/actions';
import {State} from '~/redux/reducers';
import {wrapper} from '~/redux/store';
import type {Dispatch} from '~/utils/redux';

const actions = {
  openDeleteModal: projectActions.openDeleteModal,
  closeDeleteModal: projectActions.closeDeleteModal,
  deleteProject: projectActions.deleteProject,
}

const mapStateToProps = (state: State) => ({
  project: state.project.target,
  modelProject: state.project.modelProject,
});

const mapDispatchToProps = (dispatch: Dispatch<State>) =>
  bindActionCreators(actions, dispatch);

type ProjectPageProps = {
  project: ModelProject | null;
  tab: string | null;
  subTab1: string | null;
} & ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>;

export const getServerSideProps = wrapper.getServerSideProps(store =>
  async (ctx): Promise<GetServerSidePropsResult<any>> => {
    const [name, tab, subTab1] = ctx.query.all || [];
    if (!tab) {
      return {
        redirect: {
          permanent: false,
          destination: `/dashboard/projects/${name}/clusters`,
        },
      }
    }
    try {
      await store.dispatch(projectActions.getByName(name));
    } catch (e: any) {
      if (e.response.status === 404) {
        return {
          redirect: {
            permanent: false,
            destination: `/dashboard/projects`
          }
        }
      }
    }
    if (tab === 'clusters') {
      await store.dispatch(projectActions.getClusters(name, subTab1));
    }
    if (tab === 'containers') {
      try {
        await store.dispatch(projectActions.getContainers(name, subTab1));
      } catch (e) {
        console.error(e);
      }
    }
    if (tab === 'pipelines') {
      await store.dispatch(projectActions.getPipelines(name));
    }
    if (tab === 'metrix') {
      // const domain = store.getState().project?.target?.clusterProduction?.domain;
      // if (domain) {
      //   await store.dispatch(projectActions.metrixDomainPath(domain));
      //   await store.dispatch(projectActions.metrixDomainStatus(domain));
      //   await store.dispatch(projectActions.metrixDomainArt(domain));
      //   await store.dispatch(projectActions.metrixDomainReqCount(domain));
      // }
    }
    return {
      props: {
        tab: tab || null,
        subTab1: subTab1 || null,
      },
    }
  }
)

function ProjectPage(props: ProjectPageProps) {
  const {
    tab,
    subTab1,
    project,
    modelProject,
    deleteProject,
    openDeleteModal,
    closeDeleteModal,
  } = props;
  if (!project) return null;
  const router = useRouter();

  async function onOpenModalDeleteProject(data: ModelProject) {
    await openDeleteModal(data);
  }

  async function onDeleteProject() {
    if (!modelProject.data) return;
    await deleteProject(modelProject.data.name);
    router.replace('/dashboard/projects');
  }

  return (
    <React.Fragment>
      <Head>
        <title>Projects - Dashboard - nxtranet</title>
      </Head>
      <DashboardHeader />
      <ModalConfirm
        title="Warning"
        isVisible={modelProject.isModalDeleteOpen}
        onCancel={closeDeleteModal}
        onConfirm={onDeleteProject}
        description={`Are you sure to delete project \`${modelProject.data?.name}\``}
      />
      <Project
        tab={tab}
        data={project}
        subTab1={subTab1}
        onOpenDeleteModal={onOpenModalDeleteProject}
      />
    </React.Fragment>
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectPage);
