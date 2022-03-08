import type {ModelCluster, ModelPipeline} from '@nxtranet/headers';
import type {NextRouter} from 'next/router';
import {withRouter} from 'next/router';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {debounceTime, Subject} from 'rxjs';
import ClusterCard from '~/components/ClusterCard';
import DashboardTitle from '~/components/DashboardTitle';
import {ModalRelationLink} from '~/components/ModalRelationLink';
import {openModalConfirm, openModalForm} from '~/redux/actions/modal';
import {clearProjectCluster, createClusterPipelineLink, getProjectClusterByName, getProjects} from '~/redux/actions/project';
import type {State} from '~/redux/reducers';
import {IconPipeline, IconPlus} from '~/styles/icons';
import {Dispatch} from '~/utils/redux';
import * as Style from './DashboardProjectClusters.s';

const actions = {
  createClusterPipelineLink,
  openModalConfirm,
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

type DashboardProjectClustersContainerState = {
  isModalPipelineLinkOpen: boolean;
}

class DashboardProjectClustersContainer extends
  React.PureComponent<DashboardProjectClustersContainerProps, DashboardProjectClustersContainerState> {

  state: DashboardProjectClustersContainerState = {
    isModalPipelineLinkOpen: false,
  };

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

  // formContainerDeploy
  onClickNewContainer = () => {
    const {cluster} = this.props;
    if (!cluster) return;
    this.props.openModalForm({
      title: 'New container',
      iconKey: 'IconContainer',
      formKey: 'formContainerDeploy',
      formSubmitTitle: 'New',
      formSubmitKey: 'clusterDeploy',
      formSubmitArgs: [cluster.namespace],
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

  onCreatePipelineLink = async (pipeline: ModelPipeline) => {
    const {cluster} = this.props;
    if (!cluster) return;
    await this.props.createClusterPipelineLink({
      clusterId: cluster.id,
      pipelineId: pipeline.id
    });
    this.closeModalPipelineLink();
  };

  onOpenModalPipelineLink = () => {
    this.setState({
      isModalPipelineLinkOpen: true,
    });
  };

  closeModalPipelineLink = () => {
    this.setState({
      isModalPipelineLinkOpen: false,
    });
  };

  onClickPipelineLink = (pipeline: ModelPipeline) => {
    const {cluster} = this.props;
    if (!cluster) return;
    this.props.openModalConfirm({
      title: `Are you sure to unlink pipeline ${pipeline.name} ?`,
      description: 'This action is not reversible and all containers emiting status for this pipeline will be ignored',
      onConfirmKey: 'deleteClusterPipelineLink',
      onConfirmArgs: [{
        clusterId: cluster.id,
        pipelineId: pipeline.id
      }],
    });
  };

  render() {
    const {
      tab,
      subtab,
      cluster,
      clusters,
      projectName,
      isClusterPending,
    } = this.props;
    const {isModalPipelineLinkOpen} = this.state;
    return (
      <React.Fragment>
        <ModalRelationLink
          title="Link pipeline"
          description="Click on item to link pipeline"
          icon={<IconPipeline size={40} />}
          isVisible={isModalPipelineLinkOpen}
          onClickCancel={this.closeModalPipelineLink}
          onClickItem={this.onCreatePipelineLink}
          value={cluster?.pipelines || []}
          options={{
            path: `/projects/${projectName}/pipelines`,
            returnKey: 'id',
            key: 'id',
            displayKey: 'name',
          }}
        />
        <DashboardTitle
          title={`${tab}${subtab ? `/${subtab}` : ''}`}
          actions={[{
            title: `New cluster in project ${projectName}`,
            icon: () => <IconPlus size={12} />,
            fn: this.onClickCreateCluster,
          }]}
        />
        <Style.ClusterCardContainer>
          {(clusters || []).map((clusterRow) => (
            <ClusterCard
              key={clusterRow.id}
              onClick={this.onClickClusterRx}
              isLoading={isClusterPending}
              isExtended={clusterRow.name === subtab}
              isVisible={!subtab ? true : clusterRow.name === subtab}
              data={cluster && subtab && (clusterRow.name === subtab) ? cluster : clusterRow}
              onClickNewPipelineLink={this.onOpenModalPipelineLink}
              onClickPipelineLink={this.onClickPipelineLink}
              onClickNewContainer={this.onClickNewContainer}
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
