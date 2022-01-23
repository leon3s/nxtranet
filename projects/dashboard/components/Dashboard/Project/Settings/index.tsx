import type {ModelProject} from '@nxtranet/headers';
import {NextRouter, withRouter} from 'next/router';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Reform from '~/components/Shared/ReForm';
import {projectActions} from '~/redux/actions';
import type {State} from '~/redux/reducers';
import {Dispatch} from '~/utils/redux';
import * as Style from './style';

const actions = {
  patchProject: projectActions.patchProject,
};

const mapStateToProps = ({ }: State) => ({
});

const mapDispatchToProps = (dispatch: Dispatch<State>) =>
  bindActionCreators(actions, dispatch)

type SettingsProps = {
  projectName: string;
  project: ModelProject;
  router: NextRouter;
}
  & ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>;

type SettingsState = {};

class Settings extends
  React.PureComponent<SettingsProps, SettingsState> {

  state: SettingsState = {};

  componentDidMount() { }

  onSubmit = async (projectData: ModelProject) => {
    console.error('TO DO ACTION AND BINDING ', projectData);
    await this.props.patchProject(this.props.projectName, projectData);
  }

  render() {
    const {
      project,
    } = this.props;
    const { } = this.state;
    return (
      <React.Fragment>
        <Style.Container>
          <Reform
            schema={[
              {title: 'Name', key: 'name', type: 'String'},
              {title: 'Github Project', key: 'github_project', type: 'String'},
              {title: 'Github Username', key: 'github_username', type: 'String'},
              {title: 'Github Password', key: 'github_password', type: 'String'},
              {title: 'Github Webhook', key: 'github_webhook', type: 'String'},
              {title: 'Github Webhook Secret', key: 'github_webhook_secret', type: 'String'},
            ]}
            onSubmit={this.onSubmit}
            data={project}
            submitTitle="Update"
            isButtonLoadingResolving
            isButtonCancelEnabled={false}
          />
        </Style.Container>
      </React.Fragment>
    )
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Settings));
