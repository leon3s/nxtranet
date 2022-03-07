import Mustache from 'mustache';
import type {NextRouter} from 'next/router';
import {withRouter} from 'next/router';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ModalConfirm from '~/components/ModalConfirm';
import * as formActions from '~/redux/actions/hashmap';
import {closeModalConfirm} from '~/redux/actions/modal';
import type {State} from '~/redux/reducers';
import type {Dispatch} from '~/utils/redux';

const actions = {
  closeModalConfirm,
};

const formActionBindinds = formActions;

const mapStateToProps = (state: State) => ({
  modalConfirm: state.modal.confirm,
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

  onConfirmHook = async () => {
    const {modalConfirm, formActions} = this.props;
    const {props} = modalConfirm;
    if (!props) return;
    const action = formActions[props.onConfirmKey] as any;
    try {
      await action(...props.onConfirmArgs);
      this.props.closeModalConfirm();
    } catch (e) {};
  };

  render() {
    const {
      modalConfirm,
      closeModalConfirm,
    } = this.props;
    const data = modalConfirm.props?.mustacheData || {};
    let title = modalConfirm.props?.title || '';
    let description = modalConfirm.props?.description || '';
    title = Mustache.render(title, data);
    description = Mustache.render(description, data);
    return (
      <ModalConfirm
        title={title}
        onConfirm={this.onConfirmHook}
        description={description}
        onCancel={closeModalConfirm}
        isVisible={modalConfirm.isVisible}
      />
    );
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ModalFormContainer));
