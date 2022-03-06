import React from 'react';
import { bindActionCreators } from 'redux';
import { Dispatch } from '~/utils/redux';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import type { NextRouter } from 'next/router';
import type { State } from '~/redux/reducers';

import * as Style from './style';
import Title from '~/components/Title';
import Text from '~/components/Text';

import {setCounter} from '~/redux/actions/home';
import Button from '~/components/Button';

const actions = {
  setCounter,
};

const mapStateToProps = (state: State) => ({
  counter: state.home.counter,
});

const mapDispatchToProps = (dispatch: Dispatch<State>) =>
  bindActionCreators(actions, dispatch);

export type HomeContainerProps = {
  router: NextRouter;
}
  & ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>;

class HomeContainer extends
  React.PureComponent<HomeContainerProps> {

  onClick = () => {
    this.props.setCounter(this.props.counter + 1);
  };

  render() {
    const {
      counter
    } = this.props;
    return (
      <Style.Container>
        <Style.Center>
          <Title>
            NEXT JS STARTER
          </Title>
          <Text>
            Counter value {`[${counter}]`}
          </Text>
          <Button
            onClick={this.onClick}
          >
            Click on me
          </Button>
        </Style.Center>
      </Style.Container>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(HomeContainer));
