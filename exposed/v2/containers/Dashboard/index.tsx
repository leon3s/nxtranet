import React from 'react';
import { bindActionCreators } from 'redux';
import { Dispatch } from '~/utils/redux';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import type { NextRouter } from 'next/router';

import type { State } from '~/redux/reducers';
import {setCounter} from '~/redux/actions/home';

import LinearBackground from '~/components/LinearBackground';
// import {
//   IconMetrix,
//   IconCluster,
//   IconSetting,
//   IconContainer,
//   IconPipeline,
// } from '~/styles/icons';

import DashboardHeader from '../DashboardHeader';
import Footer from '../Footer';

import HomeContainer from '../Home';
import DashboardProjectsContainer from '../DashboardProjects';

import * as Style from './style';

const actions = {
  setCounter,
};

const mapStateToProps = (state: State) => ({
  counter: state.home.counter,
});

const mapDispatchToProps = (dispatch: Dispatch<State>) =>
  bindActionCreators(actions, dispatch);

export type DashboardContainerProps = {
  router: NextRouter;
} & ReturnType<typeof mapStateToProps>
& ReturnType<typeof mapDispatchToProps>;

// const navItems = [
//   {
//     displayName: 'Clusters',
//     name: 'clusters',
//     href: '/clusters',
//     icon: () => <IconCluster
//       size={16}
//     />,
//   },
//   {
//     displayName: 'Pipelines',
//     name: 'pipelines',
//     href: '/pipelines',
//     icon: () => <IconPipeline
//       size={16}
//     />,
//   },
//   {
//     displayName: 'Containers',
//     name: 'containers',
//     href: '/containers',
//     icon: () => <IconContainer
//       size={16}
//     />,
//   },
//   {
//     displayName: 'Settings',
//     name: 'settings',
//     href: '/settings',
//     icon: () => <IconSetting
//       size={16}
//     />,
//   },
//   {
//     displayName: 'Metrix',
//     name: 'metrix',
//     href: '/metrix',
//     icon: () => <IconMetrix
//       size={16}
//     />,
//   }
// ];

const tabComponentHash: Record<string, React.ReactNode> = {
  default: <HomeContainer />,
  projects: <DashboardProjectsContainer />,
};

class DashboardContainer extends
  React.PureComponent<DashboardContainerProps> {

  onClick = () => {
    this.props.setCounter(this.props.counter + 1);
  };

  render() {
    const [tab] = this.props.router.query.all || [] as string[];
    const Component = tabComponentHash[tab || 'default'];
    return (
      <React.Fragment>
        <Style.Container>
          <DashboardHeader />
          <LinearBackground>
            {Component}
          </LinearBackground>
        </Style.Container>
        <Footer />
      </React.Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DashboardContainer));
