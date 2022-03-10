import {ModelCluster, ModelContainer, ModelPipeline, ModelProject} from '@nxtranet/headers';
import {
  HYDRATE
} from 'next-redux-wrapper';
import type {ReducerHooks} from '~/utils/reducer';
import {createReducer} from '~/utils/reducer';
import type {ReducerAction} from '~/utils/redux';
import {
  CLEAR_PROJECT_CLUSTER,
  CLEAR_PROJECT_PIPELINE,
  clusterDeploy,
  CLUSTER_DEPLOY,
  createClusterPipelineLink,
  createPipelineCmd,
  createProject,
  createProjectCluster,
  createProjectPipeline,
  CREATE_CLUSTER_PIPELINE_LINK,
  CREATE_PIPELINE_CMD,
  CREATE_PROJECT,
  CREATE_PROJECT_CLUSTER,
  CREATE_PROJECT_PIPELINE,
  deleteClusterPipelineLink,
  DELETE_CLUSTER_PIPELINE_LINK,
  getContainerMetrixByName,
  getProjectByName,
  getProjectClusterByName,
  getProjectContainer,
  getProjectContainers,
  getProjectPipelineByNamespace,
  getProjects,
  GET_CONTAINER_METRIX_BY_NAME,
  GET_PROJECTS,
  GET_PROJECT_BY_NAME,
  GET_PROJECT_CLUSTER_BY_NAME,
  GET_PROJECT_CONTAINER,
  GET_PROJECT_CONTAINERS,
  GET_PROJECT_PIPELINE_BY_NAMESPACE
} from '../actions/project';

export type ProjectsState = {
  data: ModelProject[];
  isDataPending: boolean;
  current: ModelProject;
  cluster: ModelCluster | null;
  pipeline: ModelPipeline | null;
  isCurrentClusterPending: boolean;
  isCurrentPipelinePending: boolean;
  containers: ModelContainer[];
  container: ModelContainer | null;
  isCurrentContainerPending: boolean;
  containerMetrix: any | null;
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
  containers: [],
  cluster: null,
  pipeline: null,
  container: null,
  containerMetrix: null,
  isCurrentPipelinePending: true,
  isCurrentClusterPending: true,
  isCurrentContainerPending: true,
};

const reducerHooks: ReducerHooks<ProjectsState> = {
  [HYDRATE]:
    (state, action) => ({
      ...state,
      current: action.payload.projects.current,
      cluster: action.payload.projects.cluster,
      pipeline: action.payload.projects.pipeline,
      isCurrentClusterPending: action.payload.projects.isCurrentClusterPending,
      isCurrentPipelinePending: action.payload.projects.isCurrentPipelinePending,
    }),
  [GET_PROJECTS.PENDING]:
    (state) => ({
      ...state,
      data: [],
      isDataPending: true,
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
          ...(state.current.clusters || []),
          action.payload.data,
        ]
      }
    }),
  [CLEAR_PROJECT_PIPELINE.DEFAULT]:
    (state) => ({
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
    }),
  [CREATE_CLUSTER_PIPELINE_LINK.FULFILLED]:
    (state, action: ReducerAction<typeof createClusterPipelineLink>) => {
      const {cluster} = state;
      if (!cluster) return state;
      return ({
        ...state,
        cluster: {
          ...cluster,
          pipelines: [
            ...(cluster.pipelines || []),
            action.payload.pipeline,
          ]
        }
      });
    },
  [DELETE_CLUSTER_PIPELINE_LINK.FULFILLED]:
    (state, action: ReducerAction<typeof deleteClusterPipelineLink>) => {
      const {cluster} = state;
      if (!cluster) return state;
      return ({
        ...state,
        cluster: {
          ...cluster,
          pipelines: (cluster.pipelines).filter((pipeline) =>
            pipeline.id !== action.payload.pipelineId
          )
        }
      });
    },
  [GET_PROJECT_CONTAINERS.FULFILLED]:
    (state, action: ReducerAction<typeof getProjectContainers>) => ({
      ...state,
      containers: action.payload.data,
    }),
  [GET_PROJECT_CONTAINER.PENDING]: (state) => ({
    ...state,
    isCurrentContainerPending: true,
  }),
  [GET_PROJECT_CONTAINER.FULFILLED]:
    (state, action: ReducerAction<typeof getProjectContainer>) => ({
      ...state,
      container: action.payload.data,
      isCurrentContainerPending: false,
    }),
  [CREATE_PROJECT_PIPELINE.FULFILLED]:
    (state, action: ReducerAction<typeof createProjectPipeline>) => {
      const {current} = state;
      if (!current) return state;
      return ({
        ...state,
        current: {
          ...current,
          pipelines: [...(current.pipelines || []), action.payload.data],
        }
      });
    },
  [CREATE_PIPELINE_CMD.FULFILLED]:
    (state, action: ReducerAction<typeof createPipelineCmd>) => {
      const {pipeline} = state;
      if (!pipeline) return state;
      return ({
        ...state,
        pipeline: {
          ...pipeline,
          commands: [...(pipeline.commands || []), action.payload.data],
        }
      })
    },
  [CLUSTER_DEPLOY.FULFILLED]:
    (state, action: ReducerAction<typeof clusterDeploy>) => {
      const {cluster} = state;
      if (!cluster) return state;
      return ({
        ...state,
        cluster: {
          ...cluster,
          containers: [
            ...(cluster.containers || []),
            ...action.payload.data,
          ]
        }
      });
    },
  [GET_CONTAINER_METRIX_BY_NAME.FULFILLED]:
    (state, action: ReducerAction<typeof getContainerMetrixByName>) => ({
      ...state,
      containerMetrix: action.payload.data,
    })
};

const reducer = createReducer<ProjectsState>(initialState, reducerHooks);

export default reducer;
