import React from 'react';
import Modal from './Modal';
import type {ModalTitleProps} from './ModalTitle';
import ModalTitle from './ModalTitle';
import type {ReformProps} from './Re/Form';
import Reform from './Re/Form';

export type ModalFormProps = {
  isVisible: boolean;
  formProps: ReformProps;
} & ModalTitleProps;

export default class ModalForm extends React.PureComponent<ModalFormProps> {
  render() {
    const {
      icon,
      title,
      isVisible,
      formProps,
    } = this.props;
    return (
      <Modal
        isVisible={isVisible}
        title={
          <ModalTitle
            icon={icon}
            title={title}
          />
        }
      >
        <Reform
          {...formProps}
        />
      </Modal>
    );
  }
}
