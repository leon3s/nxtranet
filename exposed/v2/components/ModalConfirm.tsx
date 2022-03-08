import React from 'react';
import Modal from '~/components/Modal';
import {IconConfirm} from '~/styles/icons';
import * as Style from './ModalConfirm.s';
import ModalTitle from './ModalTitle';
import Subtitle from './Subtitle';

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
  };

  onConfirmHook = () => {
    this.setState({
      isConfirmLoading: true,
      isConfirmSuccess: false,
    });
    return this.props.onConfirm()?.then(() => {
      this.setState({
        isConfirmLoading: false,
        isConfirmSuccess: false,
      });
    }).catch((err) => {
      this.setState({
        isConfirmLoading: false,
        isConfirmSuccess: false,
      });
      return err;
    });
  };

  render() {
    const {
      isConfirmLoading,
      isConfirmSuccess,
    } = this.state;
    return (
      <Modal
        title={
          <ModalTitle
            title="Warning"
            icon={<IconConfirm size={40} />}
          />
        }
        isVisible={this.props.isVisible}
      >
        <Style.Container>
          <Subtitle>
            {this.props.title}
          </Subtitle>
          <Style.ModalDescription>
            {this.props.description}
          </Style.ModalDescription>
          <Style.ButtonContainer
            isConfirmLoading={isConfirmLoading}
            isConfirmSuccess={isConfirmSuccess}
          >
            <Style.ButtonCancel
              isResolving
              colorType='danger'
              onClick={this.props.onCancel}
            >
              Cancel
            </Style.ButtonCancel>
            <Style.Button
              isResolving
              onClick={this.onConfirmHook}
            >
              Confirm
            </Style.Button>
          </Style.ButtonContainer>
        </Style.Container>
      </Modal>
    );
  }
}
