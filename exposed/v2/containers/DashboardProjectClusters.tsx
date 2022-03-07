import {ModelCluster} from '@nxtranet/headers';
import type {NextRouter} from 'next/router';
import {withRouter} from 'next/router';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {debounceTime, Subject} from 'rxjs';
import ClusterCard from '~/components/ClusterCard';
import DashboardTitle from '~/components/DashboardTitle';
import {openModalForm} from '~/redux/actions/modal';
import {clearProjectCluster, getProjectClusterByName, getProjects} from '~/redux/actions/project';
import type {State} from '~/redux/reducers';
import {IconPlus} from '~/styles/icons';
import {Dispatch} from '~/utils/redux';
import * as Style from './DashboardProjectClusters.s';

const actions = {
  getProjectClusterByName,
  clearProjectCluster,
  openModalForm,
  getProjects,
};

const mapStateToProps = (state: State) => ({
  clusters: state.projects.current.clusters,
  cluster: state.projects.cluster,
  isClusterPending: state.projects.isCurrentClusterPending,
  // i: state.projects.isDataPending,
});

const mapDispatchToProps = (dispatch: Dispatch<State>) =>
  bindActionCreators(actions, dispatch);

export type DashboardProjectClustersContainerProps = {
  router: NextRouter;
  projectName: string;
  tab: string;
  subtab: string;
} & ReturnType<typeof mapStateToProps>
& ReturnType<typeof mapDispatchToProps>;

class DashboardProjectClustersContainer extends
  React.PureComponent<DashboardProjectClustersContainerProps> {

  sub = new Subject<string | null>();

  controller: AbortController | null = null;

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

  getProjectClusterByName = async (clusterName?: string | null) => {
    console.log('getProjectClusterByName', {
      clusterName,
    });
    const {projectName} = this.props;
    if (clusterName) {
      this.controller = new AbortController();
      await this.props.getProjectClusterByName(projectName, clusterName, {
        signal: this.controller.signal
      });
    }
  };

  onClickClusterRx = (cluster: ModelCluster) => {
    const {router} = this.props;
    const [{}, {}, subtab] = router.query.all as string[];
    this.props.clearProjectCluster();
    if (this.controller) {
      this.controller.abort();
      this.controller = null;
    }
    if (subtab !== cluster.name) {
      this.sub.next(cluster.name);
    }
  };

  componentDidMount() {
    this.sub.pipe(
      debounceTime(750),
    ).subscribe((clusterName) => {
      this.getProjectClusterByName(clusterName);
    });
  }

  componentWillUnmount() {
    if (this.controller) {
      this.controller.abort();
      this.controller = null;
    }
    this.sub.unsubscribe();
  }

  render() {
    const {
      tab,
      subtab,
      cluster,
      clusters,
      projectName,
      isClusterPending,
    } = this.props;
    return (
      <React.Fragment>
        <DashboardTitle
          title={`${projectName}/${tab}`}
          actions={[{
            title: `New cluster in project ${projectName}`,
            icon: () => <IconPlus size={12} />,
            fn: this.onClickCreateCluster,
          }]}
        />
        <Style.ClusterCardContainer>
          {clusters.map((clusterRow) => (
            <ClusterCard
              key={clusterRow.id}
              onClick={this.onClickClusterRx}
              isLoading={isClusterPending}
              isExtended={clusterRow.name === subtab}
              isVisible={!subtab ? true : clusterRow.name === subtab}
              data={cluster && subtab && (clusterRow.name === subtab) ? cluster : clusterRow}
            />
          ))}
        </Style.ClusterCardContainer>
      </React.Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DashboardProjectClustersContainer));
