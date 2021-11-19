import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {NextRouter, withRouter} from 'next/router';
import RingLoader from 'react-spinners/RingLoader';

import { projectActions } from '~/redux/actions';
import ContainerCard from './ContainerCard';
import * as Style from './style';

import type { State } from '~/redux/reducers';
import type { ModelContainer } from '@nxtranet/headers';
import { Dispatch } from '~/utils/redux';
import ActionBar from '~/components/Shared/ActionBar';
import { ActionWrapper } from '../style';
import { AiOutlinePlus } from 'react-icons/ai';

const mapStateToProps = (
  state: State,
) => ({
  containers: state.project.target_containers,
});

const actions = {
  getContainers: projectActions.getContainers,
  containerStatus: projectActions.containerStatus,
  containerStatusOff: projectActions.containerStatusOff,
}

const mapDispatchToProps = (dispatch: Dispatch<State>) =>
  bindActionCreators<any, typeof actions>(actions, dispatch);

type              ContainersProps = {
  projectName:    string;
  containerName:  string | null;
  router:         NextRouter;
}
& ReturnType<typeof mapStateToProps>
& ReturnType<typeof mapDispatchToProps>;

type ContainersState = {};

class Containers extends
  React.PureComponent<ContainersProps, ContainersState> {
  
  state: ContainersState = {
  };

  componentDidMount() {
    const {
      containerName,
    } = this.props;
    if (containerName) {
      this.onContainerStatus();
    }
  }

  componentDidUpdate(prevProps: ContainersProps) {
    if (prevProps.containerName && !this.props.containerName) {
      this.offContainerStatus();
    } else if (!prevProps.containerName && this.props.containerName) {
      this.onContainerStatus();
    }
  }

  onContainerStatus = () => {
    const {
      containers: [container],
    } = this.props;
    this.props.containerStatus(container.namespace);
  }

  offContainerStatus = () => {
    const {
      containers: [container],
    } = this.props;
    this.props.containerStatusOff(container.namespace);
  }

  componentWillUnmount() {
    const {
      containerName,
    } = this.props;
    if (containerName) {
      this.offContainerStatus();
    }
  }

  onClickCard = (container: ModelContainer) => {
    const {
      containerName,
      router,
      projectName,
    } = this.props;
    if (container.name === containerName) {
      router.push(`/dashboard/projects/${projectName}/containers`);
    } else {
      router.push(`/dashboard/projects/${projectName}/containers/${container.name}`);
    }
  }

  render() {
    const {
      containers,
      projectName,
      containerName,
    } = this.props;
    const {
    } = this.state;
    return (
      <React.Fragment>
        <Style.Container>
        <ActionWrapper>
            <ActionBar actions={[
              {
                title: 'Create',
                fn: () => console.warn('todo xd'),
                icon: () => <AiOutlinePlus size={12} />,
              }
            ]} />
          </ActionWrapper>
          <Style.ContainersContainer>
            {containers.map((container) => (
              <ContainerCard
                data={container}
                key={container.id}
                projectName={projectName}
                onClick={this.onClickCard}
                isVisible={containerName === container.name}
              />
            ))}
          </Style.ContainersContainer>
        </Style.Container>
      </React.Fragment>
    )
  }
}

export default withRouter(
connect(
  mapStateToProps,
  mapDispatchToProps,
)(Containers));
