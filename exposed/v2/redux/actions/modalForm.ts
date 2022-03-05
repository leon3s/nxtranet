import {defineAction} from '~/utils/redux';
import {createAction} from '~/utils/redux';

import type {State} from '../reducers';
import type {Icons} from '~/styles/icons';

import type {FormActionKey} from './form';
import type {FormHashmapKey} from '~/forms/hashmap';

export type OpenModalFormArgs = {
  title: string;
  formSubmitTitle: string;
  iconKey: Icons;
  formKey: FormHashmapKey;
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

const DEFINES = {
  OPEN_MODAL_FORM,
  CLOSE_MODAL_FORM,
};

export default DEFINES;
