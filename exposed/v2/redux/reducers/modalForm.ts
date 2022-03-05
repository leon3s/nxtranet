import { createReducer } from '~/utils/reducer';

import MODAL_FORM_DEFINES, {
  openModalForm,
} from '../actions/modalForm';

import type {ReducerAction} from '~/utils/redux';
import type {ReducerHooks} from '~/utils/reducer';
import type {OpenModalFormArgs} from '../actions/modalForm';

export type ModalFormState = {
  data: any;
  isVisible: boolean;
  props: OpenModalFormArgs | null;
  errors?: Record<string, string> | null;
};

const initialState: ModalFormState = {
  isVisible: false,
  data: null,
  props: null,
  errors: null,
};

const {
  OPEN_MODAL_FORM,
  CLOSE_MODAL_FORM,
} = MODAL_FORM_DEFINES;

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
      data: null,
      isVisible: false,
    }),
};

const reducer = createReducer<ModalFormState>(initialState, reducerHooks);

export default reducer;
