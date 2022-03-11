import type {GetServerSidePropsResult} from 'next';
import type {NextRouter} from 'next/router';
import React from 'react';
import {bindActionCreators} from 'redux';
import type {State} from '~/redux/reducers';
import {wrapper} from '~/redux/store';
import type {Dispatch} from '~/utils/redux';

const actions = {};

const mapStateToprops = ({ }: State) => ({
});

const mapDispatchToProps = (dispatch: Dispatch<State>) =>
  bindActionCreators(actions, dispatch);

type DashboardNginxPageProps = {
  router: NextRouter;
} & ReturnType<typeof mapStateToprops>
  & ReturnType<typeof mapDispatchToProps>

export const getServerSideProps = wrapper.getServerSideProps(({ }) =>
  async ({ }): Promise<GetServerSidePropsResult<any>> => {
    return {
      redirect: {
        permanent: false,
        destination: `/dashboard/nginx/files`,
      },
    };
  }
);

class DashboardNginxPage extends
  React.PureComponent<DashboardNginxPageProps> {
  render() {
    return (
      null
    );
  }
}

export default DashboardNginxPage;
