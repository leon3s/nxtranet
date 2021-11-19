import React from 'react';

import Modal from '~/components/Shared/Modal';

import ButtonLoading from '~/components/Shared/ButtonLoading';

import * as Style from './style';

type ModalConfirmProps = {
  title: string;
  description: string;
  isVisible: boolean;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
}

type ModalConfirmState = {
}

export default class ModalConfirm
  extends React.PureComponent<ModalConfirmProps, ModalConfirmState> {

  render() {
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
          <Style.ButtonContainer>
            <Style.ButtonCancel
              onClick={this.props.onCancel}
            >
              Cancel
            </Style.ButtonCancel>
            <ButtonLoading
              title="Confirm"
              onClick={this.props.onConfirm}
            />
          </Style.ButtonContainer>
        </Style.Container>
      </Modal>
    )
  }
}
