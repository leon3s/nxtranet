import React from 'react';
import Modal from '~/components/Shared/Modal';
import * as Style from './style';




type ModalConfirmProps = {
  title: string;
  description: string;
  isVisible: boolean;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
}

type ModalConfirmState = {
  isConfirmLoading: boolean;
  isConfirmSuccess: boolean;
}

export default class ModalConfirm
  extends React.PureComponent<ModalConfirmProps, ModalConfirmState> {

  state = {
    isConfirmLoading: false,
    isConfirmSuccess: false,
  }

  onConfirmHook = () => {
    this.setState({
      isConfirmLoading: true,
      isConfirmSuccess: false,
    });
    return this.props.onConfirm()?.then(() => {
      this.setState({
        isConfirmLoading: false,
        isConfirmSuccess: true,
      });
    }).catch((err) => {
      this.setState({
        isConfirmLoading: false,
        isConfirmSuccess: false,
      });
      return err;
    });
  }

  render() {
    const {
      isConfirmLoading,
      isConfirmSuccess,
    } = this.state;
    return (
      <Modal
        isVisible={this.props.isVisible}
      >
        <Style.Container>
          <Style.Title>
            {this.props.title}
          </Style.Title>
          <Style.Description>
            {this.props.description}
          </Style.Description>
          <Style.ButtonContainer
            isConfirmLoading={isConfirmLoading}
            isConfirmSuccess={isConfirmSuccess}
          >
            <Style.ButtonCancel
              onClick={this.props.onCancel}
            >
              Cancel
            </Style.ButtonCancel>
            <Style.Button
              title="Confirm"
              onClick={this.onConfirmHook}
            />
          </Style.ButtonContainer>
        </Style.Container>
      </Modal>
    )
  }
}
