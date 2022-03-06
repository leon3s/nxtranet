import React from 'react';
import LinearBackground from '~/components/LinearBackground';
import Footer from '../Footer';
import * as Style from './style';

export type DashboardHudContainerProps = {
  children?: React.ReactNode;
}

class DashboardHudContainer extends
  React.Component<DashboardHudContainerProps> {

  render() {
    return (
      <Style.Wrapper>
        <Style.Container>
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
