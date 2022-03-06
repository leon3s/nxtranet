import React from 'react';
import { bindActionCreators } from 'redux';
import { Dispatch } from '~/utils/redux';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';

import {closeModalForm, setModalFormData} from '~/redux/actions/modalForm';
import * as formHashmap from '~/forms/hashmap';
import * as formActions from '~/redux/actions/form';
import ModalForm from '~/components/ModalForm';

import * as Icons from '~/styles/icons';

import type { NextRouter } from 'next/router';
import type { State } from '~/redux/reducers';
import { bindPathOptions } from '~/forms/utils';

const actions = {
  closeModalForm,
  setModalFormData,
};

const formActionBindinds = formActions;

const mapStateToProps = (state: State) => ({
  modalForm: state.modalForm,
});

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
  ...(bindActionCreators(actions, dispatch)),
  formActions: bindActionCreators(formActionBindinds, dispatch),
});

export type ModalFormContainerProps = {
  router: NextRouter;
} & ReturnType<typeof mapStateToProps>
& ReturnType<typeof mapDispatchToProps>;

class ModalFormContainer extends
  React.PureComponent<ModalFormContainerProps> {

  onSubmit = async () => {
    const {modalForm, formActions} = this.props;
    if (!modalForm?.props || !modalForm.data) return;
    const action = formActions[modalForm.props.formSubmitKey] as any;
    try {
      await action(modalForm.formData);
      this.props.closeModalForm();
    } catch (e) {};
  };

  componentWillUnmount() {
    console.log('UNMOUNTING !');
  };

  render() {
    const {
      modalForm,
      setModalFormData,
      closeModalForm,
    } = this.props;
    const schema = modalForm.props?.formKey ? formHashmap[modalForm?.props?.formKey] : [];
    const Icon = modalForm.props?.iconKey ? Icons[modalForm?.props.iconKey] : undefined;
    return (
      <ModalForm
        title={modalForm.props?.title || ''}
        icon={Icon ? <Icon size={40}/> : undefined}
        formProps={{
          onChange: setModalFormData,
          onSubmit: this.onSubmit,
          onCancel: closeModalForm,
          data: modalForm.formData,
          isButtonCancelEnabled: true,
          errors: modalForm.errors || {},
          submitTitle: modalForm.props?.formSubmitTitle || '',
          schema: bindPathOptions(schema, modalForm.data || {}),
          isButtonLoadingResolving: true,
        }}
        isVisible={modalForm.isVisible}
      />
    );
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ModalFormContainer));
