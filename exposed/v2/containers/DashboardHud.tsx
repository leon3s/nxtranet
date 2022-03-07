import React from 'react';
import LinearBackground from '~/components/LinearBackground';
import DashboardHeader from './DashboardHeader';
import * as Style from './DashboardHud.s';
import Footer from './Footer';

export type DashboardHudContainerProps = {
  children?: React.ReactNode;
}

class DashboardHudContainer extends
  React.Component<DashboardHudContainerProps> {

  render() {
    return (
      <Style.Wrapper>
        <Style.Container>
          <DashboardHeader />
          <LinearBackground>
            {this.props.children}
          </LinearBackground>
        </Style.Container>
        <Footer />
      </Style.Wrapper>
    );
  }
}

export default DashboardHudContainer;
