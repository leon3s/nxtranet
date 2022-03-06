import React from 'react';
import { bindActionCreators } from 'redux';
import { Dispatch } from '~/utils/redux';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import type { NextRouter } from 'next/router';
import type { State } from '~/redux/reducers';

import { openModalForm } from '~/redux/actions/modalForm';
import { getProjects } from '~/redux/actions/project';

import ProjectCard from '~/components/ProjectCard';
import DashboardContent from '~/components/DashboardContent';
import DashboardTitle from '~/components/DashboardTitle';

import { IconPlus } from '~/styles/icons';

import * as Style from './style';

const actions = {
  openModalForm,
  getProjects,  
};

const mapStateToProps = (state: State) => ({
  projectCards: state.projects.data,
  isPending: state.projects.isPending,
});

const mapDispatchToProps = (dispatch: Dispatch<State>) =>
  bindActionCreators(actions, dispatch);

export type DashboardProjectsContainerProps = {
  router: NextRouter;
} & ReturnType<typeof mapStateToProps>
& ReturnType<typeof mapDispatchToProps>;

class DashboardProjectsContainer extends
  React.PureComponent<DashboardProjectsContainerProps> {

  async componentDidMount() {
    try {
      await this.props.getProjects();
    } catch (e) {
      e;
    }
  }

  onClickCreateProject = () => {
    this.props.openModalForm({
      title: 'New project',
      iconKey: 'IconProject',
      formKey: 'formProject',
      formSubmitTitle: 'New',
      formSubmitKey: 'createProject',
    }, {});
  };

  render() {
    const {
      isPending,
      projectCards,
    } = this.props;
    return (
      <DashboardContent>
        <DashboardTitle
          title='Projects'
          actions={[{
            title: 'New project',
            icon: () => <IconPlus size={12} />,
            fn: this.onClickCreateProject,
          }]}
        />
        <Style.ProjectsContainer>
          {isPending ? (
            <React.Fragment>
              <ProjectCard/>
              <ProjectCard/>
            </React.Fragment>
          ) : null}
          {projectCards.map((projectCard) => (
            <ProjectCard
              data={projectCard}
              key={projectCard.id}
            />
          ))}
        </Style.ProjectsContainer>
      </DashboardContent>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DashboardProjectsContainer));
