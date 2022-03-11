import {NextRouter, withRouter} from 'next/router';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import DashboardContent from '~/components/DashboardContent';
import DashboardTitle from '~/components/DashboardTitle';
import MetrixBarChartDynamic from '~/components/MetrixBarChartDynamic';
import NumberBlocks from '~/components/NumberBlocks';
import {openModalConfirm, openModalForm} from '~/redux/actions/modal';
import {clearProjectCluster, getProjectClusterByName} from '~/redux/actions/project';
import type {State} from '~/redux/reducers';
import {Dispatch} from '~/utils/redux';

const actions = {
  openModalForm,
  openModalConfirm,
  clearProjectCluster,
  getProjectClusterByName,
};

const mapStateToProps = (state: State) => ({
  art: state.overview.art,
  uptime: state.overview.uptime,
  reqCount: state.overview.reqCount,
  statusReqCount: state.overview.statusReqCount,
  domainsReqCount: state.overview.domainsReqCount,
  networkInterfaces: state.overview.networkInterfaces,
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
      art,
      uptime,
      reqCount,
      statusReqCount,
      domainsReqCount,
      networkInterfaces,
    } = this.props;

    const networkInterface = networkInterfaces.eno1 || networkInterfaces.eth0 || networkInterfaces.wlp6s0;
    const blocks = [{
      title: 'Public Ip',
      value: networkInterface && networkInterface[0].address || 'unknow',
    }, {
      title: 'Os Uptime',
      value: uptime.toString(),
    }, {
      title: 'Requests Handled',
      value: reqCount.toString(),
    }, {
      title: 'ART',
      value: art.toString(),
    }];

    return (
      <DashboardContent>
        <DashboardTitle
          title={`Overview`}
        />
        <NumberBlocks
          data={blocks}
        />
        <MetrixBarChartDynamic
          title="Most visited domains"
          data={domainsReqCount}
        />
        <MetrixBarChartDynamic
          title="Requests status"
          data={statusReqCount}
        />
      </DashboardContent >
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DashboardOverviewContainer));
