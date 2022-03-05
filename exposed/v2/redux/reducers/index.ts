import {combineReducers} from 'redux';

import home from './home';
import modalForm from './modalForm';

const reducers = combineReducers({
  home,
  modalForm,
});

export type Store = typeof reducers;
export type State = ReturnType<typeof reducers>;
export default reducers;
