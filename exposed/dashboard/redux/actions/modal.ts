import type {FormHashmapKey} from '~/forms/hashmap';
import type {Icons} from '~/styles/icons';
import {createAction, defineAction} from '~/utils/redux';
import type {State} from '../reducers';
import type {ActionKeys} from './hashmap';

export type OpenModalFormArgs = {
  /** Title of the modal */
  title: string;
  /** Icon of the modal */
  iconKey: Icons;
  /** key to resolve form schema */
  formKey: FormHashmapKey;
  /** title of the submit button */
  formSubmitTitle: string;
  /** key to resolve action when submit is clicked */
  formSubmitKey: ActionKeys;
  /** Array passed to formSubmit fonction */
  formSubmitArgs?: any[];
  /** Data to bind for mustache */
  mustacheData?: any;
}

export type OpenModalConfirmProps = {
  title: string;
  onConfirmArgs: any[];
  mustacheData?: any;
  description: string;
  onConfirmKey: ActionKeys;
  /** Data to bind for mustache */
}

/** Action Used to open a modal form */
export const OPEN_MODAL_FORM = defineAction('OPEN_MODAL_FORM');
export const openModalForm = createAction<[
  OpenModalFormArgs,
], State, OpenModalFormArgs>(
  OPEN_MODAL_FORM, (props) =>
  props,
);

export const ON_MODAL_FORM_ERROR = defineAction('ON_MODAL_FORM_ERROR');
export const onModalFormError = createAction<[
  any
], State, any>(
  ON_MODAL_FORM_ERROR, (e) => e,
);

/** Action Used to close a modal form */
export const CLOSE_MODAL_FORM = defineAction('CLOSE_MODAL_FORM');
export const closeModalForm = createAction<[
], State, void>(
  CLOSE_MODAL_FORM, () => { },
);

export const SET_MODAL_FORM_DATA = defineAction('SET_MODAL_FORM_DATA');
export const setModalFormData = createAction<[
  any
], State, void>(
  SET_MODAL_FORM_DATA, (data) =>
  data,
);

export const OPEN_MODAL_CONFIRM = defineAction('OPEN_MODAL_CONFIRM');
export const openModalConfirm = createAction<[
  OpenModalConfirmProps,
], State, OpenModalConfirmProps>(
  OPEN_MODAL_CONFIRM, (props) =>
  props,
);

export const CLOSE_MODAL_CONFIRM = defineAction('CLOSE_MODAL_CONFIRM');
export const closeModalConfirm = createAction<[
], State, void>(
  CLOSE_MODAL_CONFIRM, () => { },
);
