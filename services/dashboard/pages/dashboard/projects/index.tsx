import type {ModelProject} from '@nxtranet/headers';
import type {GetServerSidePropsResult} from 'next';
import Error from 'next/error';
import Head from 'next/head';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import DashboardHeader from '~/components/Dashboard/Header';
import Projects from '~/components/Dashboard/Projects';
import {projectActions} from '~/redux/actions';
import type {State} from '~/redux/reducers';
import {wrapper} from '~/redux/store';
import type {Dispatch} from '~/utils/redux';

const actions = {
  createProject: projectActions.post,
}

const mapStateToProps = (state: State) => ({
  projects: state.project.data,
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
    } catch (e) {
      console.log(e);
    }
    return {
      props: {
        errorCode,
      },
    }
  }
)

function ProjectsPage(props: ProjectsPageProps) {
  async function createProject(data: ModelProject) {
    await props.createProject(data);
  }

  if (props.errorCode) {
    return <Error statusCode={props.errorCode} />
  }

  return (
    <React.Fragment>
      <Head>
        <title>Projects - Dashboard - Nextranet</title>
      </Head>
      <DashboardHeader />
      <Projects
        data={props.projects}
        onSubmitForm={createProject}
      />
    </React.Fragment>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectsPage);
