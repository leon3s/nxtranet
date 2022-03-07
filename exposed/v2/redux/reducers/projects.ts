import {ModelCluster, ModelPipeline, ModelProject} from '@nxtranet/headers';
import {
  HYDRATE
} from 'next-redux-wrapper';
import type {ReducerHooks} from '~/utils/reducer';
import {createReducer} from '~/utils/reducer';
import type {ReducerAction} from '~/utils/redux';
import PROJECTS_DEFINES, {
  createProject,
  createProjectCluster,
  getProjectByName,
  getProjectClusterByName,
  getProjectPipelineByNamespace,
  getProjects
} from '../actions/project';

const {
  GET_PROJECTS,
  CREATE_PROJECT,
  GET_PROJECT_BY_NAME,
  CLEAR_PROJECT_CLUSTER,
  CREATE_PROJECT_CLUSTER,
  GET_PROJECT_CLUSTER_BY_NAME,
  CLEAR_PROJECT_PIPELINE,
  GET_PROJECT_PIPELINE_BY_NAMESPACE,
} = PROJECTS_DEFINES;

export type ProjectsState = {
  data: ModelProject[];
  isDataPending: boolean;
  current: ModelProject;
  cluster: ModelCluster | null;
  pipeline: ModelPipeline | null;
  isCurrentClusterPending: boolean;
  isCurrentPipelinePending: boolean;
};

const initialState: ProjectsState = {
  data: [],
  isDataPending: false,
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
  cluster: null,
  pipeline: null,
  isCurrentPipelinePending: true,
  isCurrentClusterPending: true,
};

const reducerHooks: ReducerHooks<ProjectsState> = {
  [HYDRATE]:
    (state, action) => ({
      ...state,
      data: action.payload.projects.data || [],
      current: action.payload.projects.current,
      cluster: action.payload.projects.cluster,
      isCurrentClusterPending: action.payload.projects.isCurrentClusterPending,
      pipeline: action.payload.projects.pipeline,
      isCurrentPipelinePending: action.payload.projects.isCurrentPipelinePending,
    }),
  [GET_PROJECTS.PENDING]:
    (state) => ({
      ...state,
      isDataPending: true,
      data: [],
    }),
  [GET_PROJECTS.FULFILLED]:
    (state, action: ReducerAction<typeof getProjects>) => ({
      ...state,
      data: action.payload.data,
      isDataPending: false,
    }),
  [GET_PROJECTS.REJECTED]:
    (state) => ({
      ...state,
      data: [],
      isDataPending: false,
    }),
  [CREATE_PROJECT.FULFILLED]:
    (state, action: ReducerAction<typeof createProject>) => ({
      ...state,
      data: [
        ...state.data,
        action.payload.data,
      ]
    }),
  [GET_PROJECT_BY_NAME.FULFILLED]:
    (state, action: ReducerAction<typeof getProjectByName>) => ({
      ...state,
      current: action.payload.data,
    }),
  [CLEAR_PROJECT_CLUSTER.DEFAULT]:
    (state) => ({
      ...state,
      isCurrentClusterPending: true,
      cluster: null,
    }),
  [GET_PROJECT_CLUSTER_BY_NAME.PENDING]:
    (state) => ({
      ...state,
      isCurrentClusterPending: true,
      cluster: null,
    }),
  [GET_PROJECT_CLUSTER_BY_NAME.FULFILLED]:
    (state, action: ReducerAction<typeof getProjectClusterByName>) => ({
      ...state,
      isCurrentClusterPending: false,
      cluster: action.payload.data,
    }),
  [CREATE_PROJECT_CLUSTER.FULFILLED]:
    (state, action: ReducerAction<typeof createProjectCluster>) => ({
      ...state,
      current: {
        ...state.current,
        clusters: [
          ...state.current.clusters,
          action.payload.data,
        ]
      }
    }),
  [CLEAR_PROJECT_PIPELINE.DEFAULT]: (state) => ({
    ...state,
    isCurrentPipelinePending: true,
    pipeline: null,
  }),
  [GET_PROJECT_PIPELINE_BY_NAMESPACE.PENDING]:
    (state) => ({
      ...state,
      pipeline: null,
      isCurrentPipelinePending: true,
    }),
  [GET_PROJECT_PIPELINE_BY_NAMESPACE.FULFILLED]:
    (state, action: ReducerAction<typeof getProjectPipelineByNamespace>) => ({
      ...state,
      pipeline: action.payload.data,
      isCurrentPipelinePending: false,
    })
};

const reducer = createReducer<ProjectsState>(initialState, reducerHooks);

export default reducer;
