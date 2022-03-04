import type {ModelPipeline, ModelPipelineCmd} from '@nxtranet/headers';
import {NextRouter, withRouter} from 'next/router';
import React from 'react';
import {AiOutlinePlus} from 'react-icons/ai';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ActionBar, {ActionWrapper} from '~/components/Shared/ActionBar';
import ModalForm from '~/components/Shared/ModalForm';
import {projectActions} from '~/redux/actions';
import type {State} from '~/redux/reducers';
import {IconPipeline} from '~/styles/icons';
import type {Dispatch} from '~/utils/redux';
import PipelineCard from './PipelineCard';
import * as Style from './style';

const actions = {
  createPipeline: projectActions.createPipeline,
  patchPipelineCmd: projectActions.patchPipelineCmd,
  createPipelineCmd: projectActions.createPipelineCmd,
};

const mapStateToProps = (state: State) => ({
  pipelines: state.project.target_pipelines,
});

const mapDispatchToProps = (dispatch: Dispatch<State>) =>
  bindActionCreators(actions, dispatch)

type PipelinesProps = {
  projectName: string;
  router: NextRouter;
}
  & ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>;

type PipelinesState = {
  isModalCreatePipelineOpen: boolean;
};

class Pipelines extends
  React.PureComponent<PipelinesProps, PipelinesState> {

  state: PipelinesState = {
    isModalCreatePipelineOpen: false,
  };

  componentDidMount() { }

  onOpenModalCreatePipeline = () => {
    this.setState({
      isModalCreatePipelineOpen: true,
    })
  }

  onCreatePipeLine = async (data: ModelPipeline) => {
    await this.props.createPipeline(this.props.projectName, data);
    this.closeModalCreatePipeline();
  }

  closeModalCreatePipeline = () => {
    this.setState({
      isModalCreatePipelineOpen: false,
    })
  }


  onCreatePipelineCmd = async (namespace: string, data: Partial<ModelPipelineCmd>): Promise<void> => {
    await this.props.createPipelineCmd(namespace, data);
  }

  onPatchPipelineCmd = async (namespace: string, data: ModelPipelineCmd): Promise<void> => {
    await this.props.patchPipelineCmd(namespace, data);
  }

  render() {
    const {
      isModalCreatePipelineOpen,
    } = this.state;
    const {
      pipelines,
    } = this.props;
    const { } = this.state;
    return (
      <React.Fragment>
        <Style.Container>
          <ModalForm
            isVisible={isModalCreatePipelineOpen}
            title="New pipeline"
            icon={(<IconPipeline size={40} />)}
            formProps={{
              schema: [
                {
                  title: 'Color',
                  key: 'color',
                  type: 'Color',
                  isDescriptionEnabled: true,
                  description: 'Color of your pipepine',
                },
                {
                  title: 'Name',
                  key: 'name',
                  type: 'String',
                  isDescriptionEnabled: true,
                  description: 'Name of your pipepine',
                },
              ],
              isButtonCancelEnabled: true,
              onCancel: this.closeModalCreatePipeline,
              submitTitle: "Create",
              onSubmit: this.onCreatePipeLine,
            }}
          />
          <ActionWrapper
            isVisible
          >
            <ActionBar actions={[
              {
                title: 'Create',
                icon: () => <AiOutlinePlus size={12} />,
                fn: this.onOpenModalCreatePipeline,
              }
            ]} />
          </ActionWrapper>
          <Style.PipelineCardContainer>
            {pipelines.map((pipeline) => (
              <PipelineCard
                key={pipeline.id}
                isVisible={false}
                data={pipeline}
                onPatchPipelineCmd={this.onPatchPipelineCmd}
                onCreatePipelineCmd={this.onCreatePipelineCmd}
                onClick={() => { }}
              />
            ))}
          </Style.PipelineCardContainer>
        </Style.Container>
      </React.Fragment>
    )
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Pipelines));
