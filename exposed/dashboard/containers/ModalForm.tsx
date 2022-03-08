import type {NextRouter} from 'next/router';
import {withRouter} from 'next/router';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ModalForm from '~/components/ModalForm';
import * as formHashmap from '~/forms/hashmap';
import {bindPathOptions} from '~/forms/utils';
import * as formActions from '~/redux/actions/hashmap';
import {closeModalForm, onModalFormError, setModalFormData} from '~/redux/actions/modal';
import type {State} from '~/redux/reducers';
import * as Icons from '~/styles/icons';
import {Dispatch} from '~/utils/redux';

const actions = {
  closeModalForm,
  setModalFormData,
  onModalFormError,
};

const formActionBindinds = formActions;

const mapStateToProps = (state: State) => ({
  modalForm: state.modal.form,
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
    const {
      modalForm,
      formActions,
      closeModalForm,
      onModalFormError,
    } = this.props;
    if (!modalForm?.props) return;
    const {props, formData} = modalForm;
    const action = formActions[props.formSubmitKey] as any;
    try {
      await action(...[...(props?.formSubmitArgs || []), formData]);
      closeModalForm();
    } catch (e) {
      onModalFormError(e);
    };
  };

  render() {
    const {
      modalForm,
      setModalFormData,
      closeModalForm,
    } = this.props;
    const {props} = modalForm;
    const schema = props?.formKey ? formHashmap[props?.formKey] : [];
    const Icon = props?.iconKey ? Icons[props.iconKey] : undefined;
    return (
      <ModalForm
        title={props?.title || ''}
        icon={Icon ? <Icon size={40} /> : undefined}
        formProps={{
          onSubmit: this.onSubmit,
          onCancel: closeModalForm,
          onChange: setModalFormData,
          data: modalForm.formData,
          isButtonCancelEnabled: true,
          errors: modalForm.errors || {},
          isButtonLoadingResolving: true,
          submitTitle: props?.formSubmitTitle || '',
          schema: bindPathOptions(schema, props?.mustacheData || {}),
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
