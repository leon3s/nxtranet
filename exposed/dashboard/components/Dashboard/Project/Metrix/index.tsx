import type {ModelProject} from '@nxtranet/headers';
import dynamic from 'next/dynamic';
import {NextRouter, withRouter} from 'next/router';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {projectActions} from '~/redux/actions';
import type {State} from '~/redux/reducers';
import {Dispatch} from '~/utils/redux';
import type BarChart from '../../../Shared/MetrixBarChart';
import * as Style from './style';

const MetrixBarChart = dynamic(
  async (): Promise<typeof BarChart> => import("../../../Shared/MetrixBarChart").then((mod) => mod.default),
  {ssr: false}
);

const actions = {
  patchProject: projectActions.patchProject,
};

const mapStateToProps = (state: State) => ({
  metrixDomainPath: state.project.target_metrix_domain_path,
  metrixDomainStatus: state.project.target_metrix_domain_status,
});

const mapDispatchToProps = (dispatch: Dispatch<State>) =>
  bindActionCreators(actions, dispatch)

type MetrixProps = {
  projectName: string;
  router: NextRouter;
}
  & ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>;

type MetrixState = {};

class Metrix extends
  React.PureComponent<MetrixProps, MetrixState> {

  state: MetrixState = {};

  componentDidMount() { }

  onSubmit = async (projectData: ModelProject) => {
    console.error('TO DO ACTION AND BINDING ', projectData);
    await this.props.patchProject(this.props.projectName, projectData);
  }

  render() {
    const {
      metrixDomainPath,
      metrixDomainStatus,
    } = this.props;
    const { } = this.state;
    return (
      <React.Fragment>
        <Style.Container>
          <MetrixBarChart
            title="Global response status"
            color="#ff4d2f"
            data={metrixDomainStatus || []}
          />
          <Style.DomainPathContainers>
            <Style.DomainPathContainerTitle>
              Visited urls
            </Style.DomainPathContainerTitle>
            {metrixDomainPath.map((path: any) => (
              <Style.DomainPathContainer>
                <Style.DomainPathTitle>
                  {path._id}
                </Style.DomainPathTitle>
                <Style.DomainPathDescription>
                  {path.count}
                </Style.DomainPathDescription>
              </Style.DomainPathContainer>
            ))}
          </Style.DomainPathContainers>
        </Style.Container>
      </React.Fragment>
    )
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Metrix));
