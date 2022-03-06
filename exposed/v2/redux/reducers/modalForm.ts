import { createReducer } from '~/utils/reducer';

import { transformError } from '~/forms/utils';
import type {ReducerAction} from '~/utils/redux';
import type {ReducerHooks} from '~/utils/reducer';

import type {OpenModalFormArgs} from '../actions/modalForm';

import MODAL_FORM_DEFINES, {
  openModalForm,
} from '../actions/modalForm';

import PROJECT_DEFINES from '../actions/project';

const {
  CREATE_PROJECT,
} = PROJECT_DEFINES;

const {
  OPEN_MODAL_FORM,
  CLOSE_MODAL_FORM,
  SET_MODAL_FORM_DATA,
} = MODAL_FORM_DEFINES;

export type ModalFormState = {
  data: any;
  isVisible: boolean;
  props: OpenModalFormArgs | null;
  errors?: Record<string, string> | null;
  formData: any;
};

const initialState: ModalFormState = {
  isVisible: false,
  data: null,
  props: null,
  errors: null,
  formData: {},
};

const reducerHooks: ReducerHooks<ModalFormState> = {
  [OPEN_MODAL_FORM.DEFAULT]:
    (state, action: ReducerAction<typeof openModalForm>) => ({
      ...state,
      isVisible: true,
      data: action.payload.data,
      props: action.payload.props,
    }),
  [CLOSE_MODAL_FORM.DEFAULT]:
    (state) => ({
      ...state,
      errors: null,
      isVisible: false,
    }),
  [SET_MODAL_FORM_DATA.DEFAULT]: (state, action) => ({
    ...state,
    formData: action.payload,
  }),
  [CREATE_PROJECT.REJECTED]: (state, action) => {
    console.warn('CREATE_PROJECT REJECTED', {
      payload: action.payload,
    });
    return {
      ...state,
      errors: transformError(action.payload),
    };
  }
};

const reducer = createReducer<ModalFormState>(initialState, reducerHooks);

export default reducer;
