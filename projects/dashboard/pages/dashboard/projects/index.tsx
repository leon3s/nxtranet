import React from 'react';
import Head from 'next/head';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { wrapper } from '~/redux/store';
import { projectActions } from '~/redux/actions';

import Projects from '~/components/Dashboard/Projects';
import DashboardHeader from '~/components/Dashboard/Header';

import type { GetServerSidePropsResult } from 'next';
import type { State } from '~/redux/reducers';
import type { ModelProject } from '@nxtranet/headers';
import type { Dispatch } from '~/utils/redux';

const actions = {
  createProject: projectActions.post,
}

const mapStateToProps = (state: State) => ({
  projects: state.project.data,
});

const mapDispatchToProps = (dispatch: Dispatch<State>) =>
  bindActionCreators(actions, dispatch);

type ProjectsPageProps = {
}
& ReturnType<typeof mapStateToProps>
& ReturnType<typeof mapDispatchToProps>;

export const getServerSideProps = wrapper.getServerSideProps(store =>
  async ({}): Promise<GetServerSidePropsResult<any>> => {
    await store.dispatch(projectActions.get());
    return {
      props: {},
    }
  }
)

function ProjectsPage(props: ProjectsPageProps) {
  async function createProject(data: ModelProject) {
    await props.createProject(data);
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
