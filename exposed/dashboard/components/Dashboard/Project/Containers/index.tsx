import type {ModelContainer} from '@nxtranet/headers';
import {NextRouter, withRouter} from 'next/router';
import React from 'react';
import {AiOutlinePlus} from 'react-icons/ai';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ActionBar, {ActionWrapper} from '~/components/Shared/ActionBar';
import {projectActions} from '~/redux/actions';
import type {State} from '~/redux/reducers';
import {Dispatch} from '~/utils/redux';
import ContainerCard from './ContainerCard';
import * as Style from './style';

const mapStateToProps = (
  state: State,
) => ({
  project: state.project.target,
  containers: state.project.target_containers,
});

const actions = {
  getContainers: projectActions.getContainers,
  containerStatus: projectActions.containerStatus,
  containerStatusOff: projectActions.containerStatusOff,
}

const mapDispatchToProps = (dispatch: Dispatch<State>) =>
  bindActionCreators<any, typeof actions>(actions, dispatch);

type ContainersProps = {
  projectName: string;
  containerName: string | null;
  router: NextRouter;
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
      console.log('container name removed');
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
      project,
      containerName,
    } = this.props;
    const {
    } = this.state;
    console.log('container name ', {
      containerName,
    })
    if (!project) return null;
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
                project={project}
                key={`${container.id}-${projectName}`}
                projectName={projectName}
                onClick={this.onClickCard}
                isVisible={containerName && (container.name === containerName) || false}
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
