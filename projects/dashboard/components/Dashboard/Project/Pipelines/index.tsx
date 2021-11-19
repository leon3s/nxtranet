import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {NextRouter, withRouter} from 'next/router';

import Reform from '~/components/Shared/ReForm';
import Modal from '~/components/Shared/Modal';

import * as HeaderSearchStyle from '~/styles/headerSearch';
import { ButtonDefault } from '~/styles/buttons';

import { projectActions } from '~/redux/actions';
import type { State } from '~/redux/reducers';
import type { Dispatch } from '~/utils/redux';
import type { ModelPipeline, ModelPipelineCmd } from '@nxtranet/headers';

import * as Style from './style';
import PipelineCard from './PipelineCard';
import { ActionWrapper } from '../style';
import ActionBar from '~/components/Shared/ActionBar';
import { AiOutlinePlus } from 'react-icons/ai';

const actions = {
  createPipeline: projectActions.createPipeline,
  createPipelineCmd: projectActions.createPipelineCmd,
};

const mapStateToProps = (state: State) => ({
  pipelines: state.project.target_pipelines,
});

const mapDispatchToProps = (dispatch: Dispatch<State>) =>
  bindActionCreators(actions, dispatch)

type              PipelinesProps = {
  projectName:    string;
  pipelineName:   string;
  router:         NextRouter;
}
&                 ReturnType<typeof mapStateToProps>
&                 ReturnType<typeof mapDispatchToProps>;

type PipelinesState = {
  isModalCreatePipelineOpen: boolean;
};

class Pipelines extends
  React.PureComponent<PipelinesProps, PipelinesState> {
  
  state: PipelinesState = {
    isModalCreatePipelineOpen: false,
  };

  componentDidMount() {}

  onOpenModalCreatePipeline = () => {
    this.setState({
      isModalCreatePipelineOpen: true,
    })
  }

  onCreatePipeLine = async (data: ModelPipeline) => {
    await this.props.createPipeline(this.props.projectName, data);
  }

  closeModalCreatePipeline = () => {
    this.setState({
      isModalCreatePipelineOpen: false,
    })
  }
 

  onCreatePipelineCmd = async (namespace: string, data: Partial<ModelPipelineCmd>): Promise<void> => {
    await this.props.createPipelineCmd(namespace, data);
  }

  render() {
    const {
      isModalCreatePipelineOpen,
    } = this.state;
    const {
      pipelines,
    } = this.props;
    const {} = this.state;
    return (
      <React.Fragment>
        <Style.Container>
          <Modal
            isVisible={isModalCreatePipelineOpen}
          >
            <Reform
              schema={[
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
              ]}
              submitTitle="Create"
              onCancel={this.closeModalCreatePipeline}
              isButtonCancelEnabled={true}
              onSubmit={this.onCreatePipeLine}
            />
          </Modal>
          <ActionWrapper>
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
              onCreatePipelineCmd={this.onCreatePipelineCmd}
              onClick={() => {}}
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
