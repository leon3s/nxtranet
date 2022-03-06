import {combineReducers} from 'redux';

import home from './home';
import projects from './projects';
import modalForm from './modalForm';

const reducers = combineReducers({
  home,
  projects,
  modalForm,
});

export type Store = typeof reducers;
export type State = ReturnType<typeof reducers>;
export default reducers;
