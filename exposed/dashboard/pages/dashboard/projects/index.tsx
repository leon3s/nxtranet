import type {ModelProject} from '@nxtranet/headers';
import type {GetServerSidePropsResult} from 'next';
import Error from 'next/error';
import Head from 'next/head';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import DashboardHeader from '~/components/Dashboard/Header';
import Projects from '~/components/Dashboard/Projects';
import ModalConfirm from '~/components/Shared/ModalConfirm';
import {projectActions} from '~/redux/actions';
import type {State} from '~/redux/reducers';
import {wrapper} from '~/redux/store';
import type {Dispatch} from '~/utils/redux';

const actions = {
  createProject: projectActions.post,
}

const mapStateToProps = (state: State) => ({
  projects: state.project.data,
  modelProject: state.project.modelProject,
});

const mapDispatchToProps = (dispatch: Dispatch<State>) =>
  bindActionCreators(actions, dispatch);

type ProjectsPageProps = {
  errorCode: number;
}
  & ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>;

export const getServerSideProps = wrapper.getServerSideProps(store =>
  async ({ }): Promise<GetServerSidePropsResult<any>> => {
    let errorCode = 0;
    try {
      await store.dispatch(projectActions.get());
    } catch (err: any) {
      errorCode = err?.response?.status || 500;
    }
    return {
      props: {
        errorCode,
      },
    }
  }
)

function ProjectsPage(props: ProjectsPageProps) {
  const {
    errorCode,
    modelProject,
    createProject,
  } = props;
  async function onCreateProject(data: ModelProject) {
    await createProject(data);
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
        onCancel={() => { }}
        onConfirm={() => { }}
        description={`Are you sure to delete cluster \`${modelProject.data?.name}\``}
      />
      {
        errorCode ?
          <Error statusCode={errorCode} /> :
          <Projects
            data={props.projects}
            onSubmitForm={onCreateProject}
          />
      }
    </React.Fragment>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectsPage);
