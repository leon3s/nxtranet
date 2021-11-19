import React from 'react';

import {ScaleLoader} from 'react-spinners';

import { ModalTitle } from '~/styles/text';

import Modal from '../Modal';
import ButtonLoading from '../ButtonLoading';

type Action = {
  title: string;
  fn: () => Promise<void>;
}

type ModalActionFetcherProps = {
  isVisible: boolean;
  actions: Action[];
  onClose: () => void;
}

type ModalActionFetcherState = {
  outputs: Record<number, string>;
  status: Record<number, string>;
  isLoading: boolean;
  isSuccess: boolean;
}

import * as Style from './style';

export default class ModalActionFetcher
  extends React.PureComponent<ModalActionFetcherProps, ModalActionFetcherState> {

  state: ModalActionFetcherState = {
    outputs: {},
    status: {},
    isLoading: false,
    isSuccess: false,
  }

  setStatus = (i: number, value: string) => {
    this.setState({
      status: {
        ...this.state.status,
        [i]: value,
      },
    });
  }

  executeActions = async () => {
    const {
      actions
    } = this.props;

    for (const sI in actions) {
      const i = +sI;
      this.setStatus(i, 'loading');
      const action = actions[i];
      try {
        await action.fn();
        this.setStatus(i, 'passed');
      } catch (e) {
        this.setStatus(i, 'failed');
        throw e;
      }
    }
  }

  onExecute = async () => {
    if (this.state.isSuccess) {
      this.onClose();
      return;
    }
    this.setState({
      isLoading: true,
    });
    try {
      await this.executeActions();
      this.setState({
        isLoading: false,
        isSuccess: true,
      });
    } catch (e) {
      this.setState({
        isLoading: false,
      });
    }
  }

  onClose = () => {
    this.props.onClose();
    this.setState({
      isLoading: false,
      isSuccess: false,
      status: {},
      outputs: {},
    });
  }

  render() {
    const {
      actions,
      isVisible,
      onClose,
    } = this.props;
    return (
      <Modal
        isVisible={isVisible}
      >
        <Style.Container>
          <ModalTitle>
            Nginx update
          </ModalTitle>
          <Style.Actions>
            {actions.map((action, i) => (
              <Style.Action key={`action-${i}`}>
                <Style.ActionHeader>
                  <Style.ActionTitle>
                    {action.title}
                  </Style.ActionTitle>
                  {this.state.status[i] ?
                  <Style.ActionStatus>
                    <Style.ActionStatusTitle
                      isPassed={this.state.status[i] === 'passed'}
                    >
                      {this.state.status[i] !== 'loading' ?
                      `${this.state.status[i]}`
                      : 
                      <ScaleLoader
                        height={4}
                        width={2}
                        margin={1}
                        color='orange'
                      />
                      }
                    </Style.ActionStatusTitle>
                  </Style.ActionStatus>
                  : null}
                </Style.ActionHeader>
                <Style.StatusError>
                </Style.StatusError>
              </Style.Action>
            ))}
          </Style.Actions>
          <Style.Buttons
            isCenter={this.state.isLoading || this.state.isSuccess}
          >
            <Style.Cancel
              isVisible={!this.state.isLoading && !this.state.isSuccess}
              onClick={this.onClose}
              disabled={this.state.isLoading || this.state.isSuccess}
            >
              Cancel
            </Style.Cancel>
            <ButtonLoading
              title={this.state.isSuccess ? "Close" : "Execute"}
              onClick={this.onExecute}
            >
            </ButtonLoading>
          </Style.Buttons>
        </Style.Container>
      </Modal>
    )
  }
}
