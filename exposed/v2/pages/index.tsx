import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'next/router';

import {wrapper} from '~/redux/store';

import type {GetServerSidePropsResult} from 'next';
import type {NextRouter} from 'next/router';
import type {State} from '~/redux/reducers';
import type {Dispatch} from '~/utils/redux';

import HomeContainer from '~/containers/Home';

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
      <HomeContainer />
    );
  }
}

export default connect(
  mapStateToprops,
  mapDispatchToProps
)(withRouter(IndexPage));
