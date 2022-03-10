import {ModelContainer} from '@nxtranet/headers';
import type {NextRouter} from 'next/router';
import {withRouter} from 'next/router';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ContainerCard from '~/components/ContainerCard';
import ContainerInspect from '~/components/ContainerInspect';
import ContainerLogs from '~/components/ContainerLogs';
import ContainerMetrix from '~/components/ContainerMetrix';
import DashboardTitle from '~/components/DashboardTitle';
import MenuNav, {MenuNavItem} from '~/components/MenuNav';
import {openModalConfirm, openModalForm} from '~/redux/actions/modal';
import {getContainerMetrixByName, getProjectContainer, getProjectContainers} from '~/redux/actions/project';
import type {State} from '~/redux/reducers';
import {IconContainerInspect, IconContainerLog, IconMetrix} from '~/styles/icons';
import {Dispatch} from '~/utils/redux';
import * as Style from './DashboardProjectContainers.s';


const actions = {
  getContainerMetrixByName,
  getProjectContainer,
  getProjectContainers,
  openModalForm,
  openModalConfirm,
};

const mapStateToProps = (state: State) => ({
  container: state.projects.container,
  containers: state.projects.containers,
  containerMetrix: state.projects.containerMetrix,
  isCurrentContainerPending: state.projects.isCurrentContainerPending,
});

const mapDispatchToProps = (dispatch: Dispatch<State>) =>
  bindActionCreators(actions, dispatch);

export type DashboardProjectContainersContainerProps = {
  router: NextRouter;
  projectName: string;
  tab: string;
  subtab?: string;
} & ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>;

const navItems: MenuNavItem[] = [
  {
    displayName: 'Inspect',
    name: 'inspect',
    href: '/inspect',
    icon: () => <IconContainerInspect size={16} />,
  },
  {
    displayName: 'Logs',
    name: 'logs',
    href: '/logs',
    icon: () => <IconContainerLog size={16} />,
  },
  {
    displayName: 'Metrix',
    name: 'metrix',
    href: '/metrix',
    icon: () => <IconMetrix size={16} />,
  }
];

class DashboardProjectContainersContainer extends
  React.PureComponent<DashboardProjectContainersContainerProps> {

  componentDidMount() {
    const {projectName, subtab} = this.props;
    this.props.getProjectContainers(projectName);
    if (subtab) {
      this.props.getProjectContainer(projectName, subtab);
      this.props.getContainerMetrixByName(subtab);
    }
  }

  componentDidUpdate(prevProps: DashboardProjectContainersContainerProps) {
    const {projectName, subtab} = this.props;
    if (!prevProps.subtab && subtab) {
      this.props.getProjectContainer(projectName, subtab);
      this.props.getContainerMetrixByName(subtab);
    }
  }

  onClickDeleteContainer = (container: ModelContainer) => {
    this.props.openModalConfirm({
      title: `Are you sure to delete container ${container.name} ?`,
      description: 'This action is not reversible',
      onConfirmKey: 'deleteClusterContainer',
      onConfirmArgs: [container],
    });
  };

  render() {
    const {
      tab,
      subtab,
      containers,
      container,
      containerMetrix,
      projectName,
      router,
    } = this.props;
    if (subtab) {

    }
    let [{ }, { }, ignore, subsubtab] = router.query.all || [] as string[];
    subsubtab = subsubtab || 'inspect';
    return (
      <React.Fragment>
        <DashboardTitle
          title={`${tab}${subtab ? `/${subtab}` : ''}`}
        />
        <Style.ContainerContainers>
        </Style.ContainerContainers>
        {!subtab ?
          <Style.ContainerContainers>
            {(containers || []).map((container) => (
              <ContainerCard
                shallow
                baseUrl={`/dashboard/projects/${projectName}`}
                data={container}
                key={container.id}
                onClickDelete={this.onClickDeleteContainer}
              />
            ))}
          </Style.ContainerContainers>
          :
          <React.Fragment>
            <Style.MenuContainer>
              <MenuNav
                shallow
                data={navItems}
                current={subsubtab}
                baseUrl={`/dashboard/projects/${projectName}/containers/${subtab}`}
              />
            </Style.MenuContainer>
            {container && subsubtab === 'logs' ?
              <ContainerLogs data={container} />
              : null}
            {container && subsubtab === 'inspect' ?
              <ContainerInspect
                data={container}
              />
              : null}
            {containerMetrix && subsubtab === 'metrix' ?
              <ContainerMetrix
                data={containerMetrix}
              />
              : null}
          </React.Fragment>
        }
      </React.Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DashboardProjectContainersContainer));
