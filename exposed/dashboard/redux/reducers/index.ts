import {combineReducers} from 'redux';

import modal from './modal';
import overview from './overview';
import projects from './projects';

const reducers = combineReducers({
  modal,
  overview,
  projects,
});

export type Store = typeof reducers;
export type State = ReturnType<typeof reducers>;
export default reducers;
