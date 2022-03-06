import type {ReducerAction} from '~/utils/redux';
import type {ReducerHooks} from '~/utils/reducer';
import {createReducer} from '~/utils/reducer';

import type {ModelProject} from '@nxtranet/headers';

import PROJECTS_DEFINES, {
  getProjects,
  createProject,
} from '../actions/project';

const {
  GET_PROJECTS,
  CREATE_PROJECT,
} = PROJECTS_DEFINES;

export type ProjectsState = {
  data: ModelProject[];
  isPending: boolean;
};

const initialState: ProjectsState = {
  data: [],
  isPending: false,
};

const reducerHooks: ReducerHooks<ProjectsState> = {
  [GET_PROJECTS.PENDING]: (state) => ({
    ...state,
    isPending: true,
  }),
  [GET_PROJECTS.FULFILLED]:
    (state, action: ReducerAction<typeof getProjects>) => ({
      ...state,
      data: action.payload.data,
      isPending: false,
    }),
  [GET_PROJECTS.REJECTED]:
    (state, action: any) => {
      console.warn('GET_PROJECT REJECTED' , {
        payload: action.payload,
      });
      return {
        ...state,
        data: [],
        isPending: false,
      };
    },
  [CREATE_PROJECT.FULFILLED]: (state, action: ReducerAction<typeof createProject>) => ({
    ...state,
    data: [
      ...state.data,
      action.payload.data,
    ]
  }),
};

const reducer = createReducer<ProjectsState>(initialState, reducerHooks);

export default reducer;
