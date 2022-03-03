import dynamic from "next/dynamic";
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import FooterDefault from '~/components/Shared/FooterDefault';
import type BarChart from '~/components/Shared/MetrixBarChart';
import NumberBlocks from '~/components/Shared/NumberBlocks';
import type {State} from '~/redux/reducers';
import {ContainerWrapper} from '~/styles/global';
import type {Dispatch} from '~/utils/redux';
import * as Style from './style';

const MetrixBarChart = dynamic(
  async (): Promise<typeof BarChart> => import("../../Shared/MetrixBarChart").then((mod) => mod.default),
  {ssr: false}
);

const actions = {
}

const mapStateToProps = (state: State) => ({
  uptime: state.home.uptime,
  art: state.home.art,
  networkInterfaces: state.home.networkInterfaces,
  nginxReqCount: state.home.nginxReqCount,
  clusterProductionCount: state.home.clusterProductionCount,
  containerRunningCount: state.home.containerRunningCount,
  metrixNginxDomains: state.home.metrixNginxDomains,
  metrixNginxStatus: state.home.metrixNginxStatus,
});

const mapDispatchToProps = (dispatch: Dispatch<State>) =>
  bindActionCreators(actions, dispatch);

type HomeProps = {
}
  & ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>;

type HomeState = {
}

class Home extends
  React.PureComponent<HomeProps, HomeState> {
  render() {
    const {
      uptime,
      art,
      containerRunningCount,
      nginxReqCount,
      clusterProductionCount,
      networkInterfaces,
      metrixNginxStatus,
      metrixNginxDomains,
    } = this.props;
    const networkInterface = networkInterfaces.eno1 || networkInterfaces.eth0;
    const blocks = [{
      title: 'Public Ip',
      value: networkInterface && networkInterface[0].address || 'unknow',
    }, {
      title: 'Os Uptime',
      value: uptime,
    }, {
      title: 'Requests Handled',
      value: nginxReqCount,
    }, {
      title: 'ART',
      value: art,
    }, {
      title: 'Clusters production',
      value: clusterProductionCount,
    }, {
      title: 'Containers Running',
      value: containerRunningCount,
    }];
    console.log(metrixNginxStatus);
    return (
      <ContainerWrapper>
        <Style.Container>
          <NumberBlocks
            data={blocks}
          />
          <Style.CharWrapper>
            <MetrixBarChart
              title="Most visited domains"
              color="#ff4d2f"
              data={metrixNginxDomains}
            />
          </Style.CharWrapper>
          <Style.CharWrapper>
            <MetrixBarChart
              title="Global response status"
              data={metrixNginxStatus}
              color="#ff4d2f"
            />
          </Style.CharWrapper>
        </Style.Container>
        <FooterDefault />
      </ContainerWrapper>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
