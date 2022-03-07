import type {NextRouter} from 'next/router';
import {withRouter} from 'next/router';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import DashboardContent from '~/components/DashboardContent';
import DashboardTitle from '~/components/DashboardTitle';
import MenuNav from '~/components/MenuNav';
import {openModalConfirm, openModalForm} from '~/redux/actions/modal';
import {clearProjectCluster, getProjectClusterByName} from '~/redux/actions/project';
import type {State} from '~/redux/reducers';
import {IconCluster, IconContainer, IconDelete, IconPipeline} from '~/styles/icons';
import {Dispatch} from '~/utils/redux';
import * as Style from './DashboardProject.s';
import DashboardProjectClusters from './DashboardProjectClusters';
import DashboardProjectPipelines from './DashboardProjectPipelines';

const navItems = [
  {
    displayName: 'Clusters',
    name: 'clusters',
    href: '/clusters',
    icon: () => <IconCluster
      size={16}
    />,
  },
  {
    displayName: 'Pipelines',
    name: 'pipelines',
    href: '/pipelines',
    icon: () => <IconPipeline
      size={16}
    />,
  },
  {
    displayName: 'Containers',
    name: 'containers',
    href: '/containers',
    icon: () => <IconContainer
      size={16}
    />,
  },
];

const actions = {
  openModalForm,
  openModalConfirm,
  clearProjectCluster,
  getProjectClusterByName,
};

const mapStateToProps = (state: State) => ({
  project: state.projects.current,
  cluster: state.projects.cluster,
  isClusterPending: state.projects.isCurrentClusterPending,
});

const mapDispatchToProps = (dispatch: Dispatch<State>) =>
  bindActionCreators(actions, dispatch);

export type DashboardProjectContainerProps = {
  tab: string;
  subtab?: string | null;
  projectName: string;
  router: NextRouter;
} & ReturnType<typeof mapStateToProps>
& ReturnType<typeof mapDispatchToProps>;

class DashboardProjectContainer extends
  React.PureComponent<DashboardProjectContainerProps> {

  onClickDeleteProject = () => {
    this.props.openModalConfirm({
      title: `Are you sure to delete project ${this.props.projectName} ?`,
      description: 'This action is not reversible and all containers and clusters included will be deleted.',
      onConfirmKey: 'deleteProjectByName',
      onConfirmArgs: [this.props.projectName],
    });
  };

  render() {
    const {
      tab,
      project,
      projectName,
      router,
    } = this.props;
    const [{}, {}, subtab] = router.query.all as string[];
    return (
      <DashboardContent>
        <DashboardTitle
          title={`Projects/${project.name}`}
          actions={[{
            title: `Delete project ${projectName}`,
            icon: () => <IconDelete size={12} />,
            fn: this.onClickDeleteProject,
          }]}
        />
        <Style.MenuNavContainer>
          <MenuNav
            data={navItems}
            current={tab}
            baseUrl={`/dashboard/projects/${projectName}`}
          />
        </Style.MenuNavContainer>
        {tab === 'clusters' ?
          <DashboardProjectClusters
            tab={tab}
            subtab={subtab}
            projectName={projectName}
          />
          : null}
        {tab === 'pipelines' ?
          <DashboardProjectPipelines
            tab={tab}
            subtab={subtab}
            projectName={projectName}
          /> : null
        }
      </DashboardContent>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DashboardProjectContainer));
