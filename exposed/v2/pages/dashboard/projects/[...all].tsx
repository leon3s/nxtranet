import type {GetServerSidePropsResult} from 'next';
import type {NextRouter} from 'next/router';
import React from 'react';
import {bindActionCreators} from 'redux';
import DashboardHud from '~/containers/DashboardHud';
import ModalForm from '~/containers/ModalForm';
import type {State} from '~/redux/reducers';
import {wrapper} from '~/redux/store';
import type {Dispatch} from '~/utils/redux';

const actions = {};

const mapStateToprops = () => ({
});

const mapDispatchToProps = (dispatch: Dispatch<State>) =>
  bindActionCreators(actions, dispatch);

type ProjectPageProps = {
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

class ProjectPage extends
  React.PureComponent<ProjectPageProps> {
  render() {
    return (
      <React.Fragment>
        <ModalForm />
        <DashboardHud />
      </React.Fragment>
    );
  }
}

export default ProjectPage;
