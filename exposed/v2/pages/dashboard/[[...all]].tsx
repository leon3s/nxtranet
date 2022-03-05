import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {wrapper} from '~/redux/store';
import {withRouter} from 'next/router';

import type {State} from '~/redux/reducers';
import type {Dispatch} from '~/utils/redux';
import type {GetServerSidePropsResult} from 'next';
import type {NextRouter} from 'next/router';

import Dashboard from '~/containers/Dashboard';
import ModalForm from '~/containers/ModalForm';

const actions = {};

const mapStateToprops = () => ({
});

const mapDispatchToProps = (dispatch: Dispatch<State>) =>
  bindActionCreators(actions, dispatch);

type IndexPageProps = {
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

class IndexPage extends
  React.PureComponent<IndexPageProps> {
  render() {
    return (
      <React.Fragment>
        <ModalForm />
        <Dashboard />
      </React.Fragment>
    );
  }
}

export default connect(
  mapStateToprops,
  mapDispatchToProps
)(withRouter(IndexPage));
