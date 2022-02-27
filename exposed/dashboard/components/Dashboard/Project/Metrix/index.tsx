import type {ModelProject} from '@nxtranet/headers';
import dynamic from 'next/dynamic';
import {NextRouter, withRouter} from 'next/router';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import type BarChart from '~/components/Shared/MetrixBarChart';
import NumberBlocks from '~/components/Shared/NumberBlocks';
import {projectActions} from '~/redux/actions';
import type {State} from '~/redux/reducers';
import {Dispatch} from '~/utils/redux';
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
  metrixDomainArt: state.project.target_metrix_domain_art,
  metrixDomainReqCount: state.project.target_metrix_domain_req_count,
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
      metrixDomainArt,
      metrixDomainReqCount,
    } = this.props;
    const { } = this.state;
    const blocks = [{
      title: 'Requests Handled',
      value: metrixDomainReqCount,
    }, {
      title: 'ART',
      value: metrixDomainArt,
    }];
    return (
      <React.Fragment>
        <Style.Container>
        <NumberBlocks
            data={blocks}
          />
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
              <Style.DomainPathContainer key={path._id}>
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
