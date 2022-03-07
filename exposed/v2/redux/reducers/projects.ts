import type {ModelProject} from '@nxtranet/headers';
import {
  HYDRATE
} from 'next-redux-wrapper';
import type {ReducerHooks} from '~/utils/reducer';
import {createReducer} from '~/utils/reducer';
import type {ReducerAction} from '~/utils/redux';
import PROJECTS_DEFINES, {
  createProject,
  getProjectByName,
  getProjects
} from '../actions/project';

const {
  GET_PROJECTS,
  CREATE_PROJECT,
  GET_PROJECT_BY_NAME,
} = PROJECTS_DEFINES;

export type ProjectsState = {
  data: ModelProject[];
  isPending: boolean;
  current: ModelProject;
};

const initialState: ProjectsState = {
  data: [],
  isPending: false,
  current: {
    id: 'testID',
    creationDate: (new Date()).toString(),
    name: 'testname',
    github_project: 'express-test-deploy',
    github_username: 'leon3s',
    github_webhook: '/webhook/test/testname',
    github_webhook_secret: 'sup3rs3cr3t',
    github_password: 'sup3rp4ssword',
    clusters: [],
    pipelines: [],
    gitBranches: [],
  },
};

const reducerHooks: ReducerHooks<ProjectsState> = {
  [HYDRATE]: (state, action) => ({
    ...state,
    current: action.payload.projects.current,
  }),
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
  [GET_PROJECT_BY_NAME.FULFILLED]: (state, action: ReducerAction<typeof getProjectByName>) => ({
    ...state,
    current: action.payload.data,
  }),
};

const reducer = createReducer<ProjectsState>(initialState, reducerHooks);

export default reducer;
