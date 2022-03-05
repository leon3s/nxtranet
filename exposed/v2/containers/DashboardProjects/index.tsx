import React from 'react';
import { bindActionCreators } from 'redux';
import { Dispatch } from '~/utils/redux';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import type { NextRouter } from 'next/router';
import type { State } from '~/redux/reducers';

import { openModalForm } from '~/redux/actions/modalForm';
import DashboardContent from '~/components/DashboardContent';
import DashboardTitle from '~/components/DashboardTitle';
import { IconPlus } from '~/styles/icons';

const actions = {
  openModalForm,
};

const mapStateToProps = (state: State) => ({
  counter: state.home.counter,
});

const mapDispatchToProps = (dispatch: Dispatch<State>) =>
  bindActionCreators(actions, dispatch);

export type DashboardProjectsContainerProps = {
  router: NextRouter;
} & ReturnType<typeof mapStateToProps>
& ReturnType<typeof mapDispatchToProps>;

class DashboardProjectsContainer extends
  React.PureComponent<DashboardProjectsContainerProps> {

  onClickCreateProject = () => {
    this.props.openModalForm({
      title: 'New project',
      iconKey: 'IconProject',
      formKey: 'formProject',
      formSubmitTitle: 'new',
      formSubmitKey: 'createProject',
    }, {});
  };

  render() {
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
      </DashboardContent>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DashboardProjectsContainer));
