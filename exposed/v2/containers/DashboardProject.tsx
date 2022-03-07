import type {NextRouter} from 'next/router';
import {withRouter} from 'next/router';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import DashboardContent from '~/components/DashboardContent';
import DashboardTitle from '~/components/DashboardTitle';
import MenuNav from '~/components/MenuNav';
import {openModalConfirm, openModalForm} from '~/redux/actions/modal';
import type {State} from '~/redux/reducers';
import {IconCluster, IconContainer, IconDelete, IconPipeline, IconPlus} from '~/styles/icons';
import {Dispatch} from '~/utils/redux';
import * as Style from './DashboardProject.s';

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
};

const mapStateToProps = (state: State) => ({
  project: state.projects.current,
});

const mapDispatchToProps = (dispatch: Dispatch<State>) =>
  bindActionCreators(actions, dispatch);

export type DashboardProjectContainerProps = {
  projectName: string;
  tab: string;
  router: NextRouter;
} & ReturnType<typeof mapStateToProps>
& ReturnType<typeof mapDispatchToProps>;

class DashboardProjectContainer extends
  React.PureComponent<DashboardProjectContainerProps> {

  onClickCreateCluster = () => {
    this.props.openModalForm({
      title: 'New cluster',
      iconKey: 'IconCluster',
      formKey: 'formCluster',
      formSubmitTitle: 'New',
      formSubmitKey: 'createProjectCluster',
      formSubmitArgs: [this.props.projectName],
      mustacheData: {
        projectName: this.props.projectName,
      },
    });
  };

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
    } = this.props;
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
        <DashboardTitle
          title={`${projectName}/clusters`}
          actions={[{
            title: `New cluster in project ${projectName}`,
            icon: () => <IconPlus size={12} />,
            fn: this.onClickCreateCluster,
          }]}
        />
      </DashboardContent>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DashboardProjectContainer));
