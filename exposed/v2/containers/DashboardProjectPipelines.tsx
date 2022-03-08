import {ModelPipeline, ModelPipelineCmd} from '@nxtranet/headers';
import type {NextRouter} from 'next/router';
import {withRouter} from 'next/router';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {debounceTime, Subject} from 'rxjs';
import DashboardTitle from '~/components/DashboardTitle';
import PipelineCard from '~/components/PipelineCard';
import {openModalConfirm, openModalForm} from '~/redux/actions/modal';
import {clearProjectPipeline, getProjectPipelineByNamespace} from '~/redux/actions/project';
import type {State} from '~/redux/reducers';
import {IconPlus} from '~/styles/icons';
import {Dispatch} from '~/utils/redux';

const actions = {
  getProjectPipelineByNamespace,
  clearProjectPipeline,
  openModalForm,
  openModalConfirm,
};

const mapStateToProps = (state: State) => ({
  pipeline: state.projects.pipeline,
  pipelines: state.projects.current.pipelines,
  isCurrentPipelinePending: state.projects.isCurrentPipelinePending,
});

const mapDispatchToProps = (dispatch: Dispatch<State>) =>
  bindActionCreators(actions, dispatch);

export type DashboardProjectPipelinesContainerProps = {
  router: NextRouter;
  projectName: string;
  tab: string;
  subtab?: string;
} & ReturnType<typeof mapStateToProps>
& ReturnType<typeof mapDispatchToProps>;

class DashboardProjectPipelinesContainer extends
  React.PureComponent<DashboardProjectPipelinesContainerProps> {

  sub = new Subject<string | null>();

  controller: AbortController | null = null;

  onClickNewPipeline = () => {
    this.props.openModalForm({
      title: 'New pipeline',
      iconKey: 'IconPipeline',
      formKey: 'formPipeline',
      formSubmitTitle: 'New',
      formSubmitKey: 'createProjectPipeline',
      formSubmitArgs: [this.props.projectName],
    });
  };

  onClickNewCmd = (data: ModelPipeline) => {
    this.props.openModalForm({
      title: 'New command',
      iconKey: 'IconPipelineCmd',
      formKey: 'formPipelineCmd',
      formSubmitTitle: 'New',
      formSubmitKey: 'createPipelineCmd',
      formSubmitArgs: [data.namespace],
    });
  };

  onClickDeleteCmd = (data: ModelPipelineCmd) => {
    this.props.openModalConfirm({
      title: `Are you sure to delete command ${data.name} ?`,
      description: 'This action is not reversible.',
      onConfirmKey: 'deletePipelineCmd',
      onConfirmArgs: [data],
    });
  };

  getProjectPipelineByNamespace = async (pipelineNamespace: string | null) => {
    console.log('getProjectPipelineByNamespace', {
      pipelineNamespace,
    });
    if (pipelineNamespace && pipelineNamespace.length) {
      this.controller = new AbortController();
      await this.props.getProjectPipelineByNamespace(pipelineNamespace, {
        signal: this.controller.signal
      });
    }
  };

  onClickPipelineRx = (pipeline: ModelPipeline) => {
    const {router} = this.props;
    const [{}, {}, subtab] = router.query.all as string[];
    this.props.clearProjectPipeline();
    if (this.controller) {
      this.controller.abort();
      this.controller = null;
    }
    if (subtab !== pipeline.namespace) {
      this.sub.next(pipeline.namespace);
    }
  };

  componentDidMount() {
    this.sub.pipe(
      debounceTime(750),
    ).subscribe((pipelineNamespace) => {
      this.getProjectPipelineByNamespace(pipelineNamespace);
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
      pipelines,
      pipeline,
      projectName,
      isCurrentPipelinePending,
    } = this.props;
    return (
      <React.Fragment>
        <DashboardTitle
          title={`${tab}${subtab ? `/${subtab}` : ''}`}
          actions={[{
            title: `New pipeline in project ${projectName}`,
            icon: () => <IconPlus size={12} />,
            fn: this.onClickNewPipeline,
          }]}
        />
        {(pipelines || []).map((pipelineRow) => (
          <PipelineCard
            isLoading={isCurrentPipelinePending}
            isVisible={!subtab ? true : pipelineRow.name === subtab}
            data={pipeline && subtab && (pipelineRow.name === subtab) ? pipeline : pipelineRow}
            key={pipelineRow.id}
            onClick={this.onClickPipelineRx}
            isExtended={pipelineRow.name === subtab}
            onClickNewCmd={this.onClickNewCmd}
            onClickDeleteCmd={this.onClickDeleteCmd}
          />
        ))}
      </React.Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DashboardProjectPipelinesContainer));
