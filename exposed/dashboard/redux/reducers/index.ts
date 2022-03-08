import {combineReducers} from 'redux';
import home from './home';
import modal from './modal';
import projects from './projects';

const reducers = combineReducers({
  home,
  modal,
  projects,
});

export type Store = typeof reducers;
export type State = ReturnType<typeof reducers>;
export default reducers;
