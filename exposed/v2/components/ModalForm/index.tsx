import React from 'react';
import Modal from '../Modal';
import type {ReformProps} from '../ReForm';
import Reform from '../ReForm';
import * as Style from './style';

export type ModalFormProps = {
  title: string;
  isVisible: boolean;
  formProps: ReformProps;
  icon?: React.ReactNode;
}

export default class ModalForm extends React.PureComponent<ModalFormProps> {
  renderTitle = () => (
    <Style.ModalFormTitleContainer>
      {this.props.icon}
      <Style.ModalFormTitle>
        {this.props.title}
      </Style.ModalFormTitle>
    </Style.ModalFormTitleContainer>
  );

  render() {
    const {
      isVisible,
      formProps,
    } = this.props;
    return (
      <Modal
        isVisible={isVisible}
        title={this.renderTitle()}
      >
        <Reform
          {...formProps}
        />
      </Modal>
    );
  }
}
