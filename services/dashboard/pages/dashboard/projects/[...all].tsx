import type {ModelProject} from '@nxtranet/headers';
import type {GetServerSidePropsResult} from 'next';
import Head from 'next/head';
import React from 'react';
import {connect} from 'react-redux';
import DashboardHeader from '~/components/Dashboard/Header';
import Project from '~/components/Dashboard/Project';
import {projectActions} from '~/redux/actions';
import {State} from '~/redux/reducers';
import {wrapper} from '~/redux/store';




interface ProjectPageProps {
  project: ModelProject | null;
  tab: string | null;
  subTab1: string | null;
}

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
    await store.dispatch(projectActions.getByName(name));
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
    if (tab === 'production') {
      await store.dispatch(projectActions.getClusterProduction(name));
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
  if (!props.project) return null;
  return (
    <React.Fragment>
      <Head>
        <title>Projects - Dashboard - Nextranet</title>
      </Head>
      <DashboardHeader />
      <Project
        tab={props.tab}
        data={props.project}
        subTab1={props.subTab1}
      />
    </React.Fragment>
  )
}

export default connect((state: State) => ({
  project: state.project.target,
}))(ProjectPage);

