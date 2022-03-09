import {transformError} from '~/forms/utils';
import type {ReducerHooks} from '~/utils/reducer';
import {createReducer} from '~/utils/reducer';
import type {ReducerAction} from '~/utils/redux';
import {CLOSE_MODAL_CONFIRM, CLOSE_MODAL_FORM, ON_MODAL_FORM_ERROR, OpenModalConfirmProps, OpenModalFormArgs, OPEN_MODAL_CONFIRM, OPEN_MODAL_FORM, SET_MODAL_FORM_DATA} from '../actions/modal';
import {
  openModalConfirm,
  openModalForm
} from '../actions/modal';


export type ModalFormState = {
  form: {
    formData: any;
    isVisible: boolean;
    errors?: Record<string, string> | null;
    props: OpenModalFormArgs | null;
  },
  confirm: {
    isVisible: boolean;
    error?: string;
    props: OpenModalConfirmProps | null;
  }
};

const initialState: ModalFormState = {
  form: {
    props: null,
    formData: {},
    errors: null,
    isVisible: false,
  },
  confirm: {
    props: null,
    isVisible: false,
  }
};

const reducerHooks: ReducerHooks<ModalFormState> = {
  [OPEN_MODAL_FORM.DEFAULT]:
    (state, action: ReducerAction<typeof openModalForm>) => ({
      ...state,
      form: {
        ...state.form,
        isVisible: true,
        props: action.payload,
      },
    }),
  [CLOSE_MODAL_FORM.DEFAULT]:
    (state) => ({
      ...state,
      form: {
        ...state.form,
        formData: {},
        errors: null,
        props: null,
        isVisible: false,
      }
    }),
  [SET_MODAL_FORM_DATA.DEFAULT]: (state, action) => ({
    ...state,
    form: {
      ...state.form,
      formData: action.payload,
    },
  }),
  [ON_MODAL_FORM_ERROR.DEFAULT]: (state, action) => ({
    ...state,
    form: {
      ...state.form,
      errors: transformError(action.payload),
    }
  }),
  [OPEN_MODAL_CONFIRM.DEFAULT]: (state, action: ReducerAction<typeof openModalConfirm>) => ({
    ...state,
    confirm: {
      isVisible: true,
      props: action.payload,
    },
  }),
  [CLOSE_MODAL_CONFIRM.DEFAULT]: (state) => ({
    ...state,
    confirm: {
      ...state.confirm,
      isVisible: false,
      data: null,
      props: null,
    }
  })
};

const reducer = createReducer<ModalFormState>(initialState, reducerHooks);

export default reducer;
