import {defineAction} from '~/utils/redux';
import {createAction} from '~/utils/redux';

import type {State} from '../reducers';
import type {Icons} from '~/styles/icons';

import type {FormActionKey} from './form';
import type {FormHashmapKey} from '~/forms/hashmap';

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
  formSubmitKey: FormActionKey;
}

/** Action Used to open a modal form */
const OPEN_MODAL_FORM = defineAction('OPEN_MODAL_FORM');
export const openModalForm = createAction<[
  OpenModalFormArgs,
  any
], State, {props: OpenModalFormArgs, data: any}>(
  OPEN_MODAL_FORM,
  (props, data) => ({props, data}),
);

/** Action Used to close a modal form */
const CLOSE_MODAL_FORM = defineAction('CLOSE_MODAL_FORM');
export const closeModalForm = createAction<[
], State, void>(
  CLOSE_MODAL_FORM,
  () => {},
);

const SET_MODAL_FORM_DATA = defineAction('SET_MODAL_FORM_DATA');
export const setModalFormData = createAction<[
  any
], State, void>(
  SET_MODAL_FORM_DATA,
  (data) => data,
);

const DEFINES = {
  OPEN_MODAL_FORM,
  CLOSE_MODAL_FORM,
  SET_MODAL_FORM_DATA,
};

export default DEFINES;
