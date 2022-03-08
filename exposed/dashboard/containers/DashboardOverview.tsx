import dynamic from 'next/dynamic';
import {NextRouter, withRouter} from 'next/router';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import DashboardContent from '~/components/DashboardContent';
import DashboardTitle from '~/components/DashboardTitle';
import LoadingBackground from '~/components/LoadingBackground';
import BarChart from '~/components/MetrixBarChart';
import NumberBlocks from '~/components/NumberBlocks';
import {openModalConfirm, openModalForm} from '~/redux/actions/modal';
import {clearProjectCluster, getProjectClusterByName} from '~/redux/actions/project';
import type {State} from '~/redux/reducers';
import {Dispatch} from '~/utils/redux';
import * as Style from './DashboardOverview.s';

const MetrixBarChart = dynamic(
  async (): Promise<typeof BarChart> => import("../components/MetrixBarChart").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <LoadingBackground />,
  }
);

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

export type DashboardOverviewContainerProps = {
  router: NextRouter;
} & ReturnType<typeof mapStateToProps>
& ReturnType<typeof mapDispatchToProps>;

class DashboardOverviewContainer extends
  React.PureComponent<DashboardOverviewContainerProps> {

  render() {
    const {
    } = this.props;
    const blocks = [{
      title: 'Public Ip',
      // value: networkInterface && networkInterface[0].address || 'unknow',
    }, {
      title: 'Os Uptime',
      // value: uptime,
    }, {
      title: 'Requests Handled',
      // value: nginxReqCount,
    }, {
      title: 'ART',
      // value: art,
    }, {
      title: 'Clusters production',
      // value: clusterProductionCount,
    }, {
      title: 'Containers Running',
      // value: containerRunningCount,
    }];

    return (
      <DashboardContent>
        <DashboardTitle
          title={`Overview`}
        />
        <NumberBlocks
          data={blocks}
        />
        <Style.BarChartContainer>
          <Style.BarCharTitle>
            Most visited domains
          </Style.BarCharTitle>
          <MetrixBarChart
            data={[]}
            color="#ff4d2a"
          />
        </Style.BarChartContainer>
      </DashboardContent>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DashboardOverviewContainer));
