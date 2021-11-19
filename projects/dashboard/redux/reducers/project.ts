import { AnyAction } from "redux";

import { PROJECT_DEFINES } from "../defines";

import type {
  ModelProject,
  ModelCluster,
  ModelPipeline,
  ModelContainer,
} from '@nxtranet/headers';

export type ProjectState = {
  data: ModelProject[],
  target: null | ModelProject;
  target_clusters: ModelCluster[];
  target_pipelines: ModelPipeline[];
  target_containers: ModelContainer[];
}

const projectReducer = (state:ProjectState = {
  data: [],
  target: null,
  target_clusters: [],
  target_pipelines: [],
  target_containers: [],
}, action: AnyAction): ProjectState => {
  if (action.type === PROJECT_DEFINES.GET.FULFILLED) {
    return {
      ...state,
      data: action.payload.data,
    }
  }
  if (action.type === PROJECT_DEFINES.POST.FULFILLED) {
    return {
      ...state,
      data: [
        action.payload.data,
        ...state.data,
      ]
    }
  }
  if (action.type === PROJECT_DEFINES.GET_BY_NAME.FULFILLED) {
    return {
      ...state,
      target: action.payload.data,
    }
  }
  if (action.type === PROJECT_DEFINES.GET_CLUSTERS.FULFILLED) {
    return {
      ...state,
      target_clusters: action.payload.data,
    };
  }
  if (action.type === PROJECT_DEFINES.POST_CLUSTERS.FULFILLED) {
    return {
      ...state,
      target_clusters: [
        action.payload.data,
        ...state.target_clusters,
      ],
    }
  }
  if (action.type === PROJECT_DEFINES.GET_CONTAINERS.FULFILLED) {
    return {
      ...state,
      target_containers: action.payload.data,
    }
  }
  if (action.type === PROJECT_DEFINES.CONTAINER_STATUS.ON_EVENT) {
    return {
      ...state,
      target_containers: [
        {
          ...state.target_containers[0],
          outputs: [
            ...(state.target_containers[0].outputs || []),
            action.payload,
          ]
        }
      ]
    }
  }
  if (action.type === PROJECT_DEFINES.GET_PIPELINES.FULFILLED) {
    return {
      ...state,
      target_pipelines: action.payload.data,
    }
  }
  if (action.type === PROJECT_DEFINES.CREATE_PIPELINE.FULFILLED) {
    return {
      ...state,
      target_pipelines: [
        ...state.target_pipelines,
        action.payload.data,
      ]
    }
  }
  if (action.type === PROJECT_DEFINES.CREATE_PIPELINE_CMD.FULFILLED) {
    return {
      ...state,
      target_pipelines: state.target_pipelines.map((pipeline) => {
        if (pipeline.namespace === action.payload.data.pipelineNamespace) {
          return {
            ...pipeline,
            commands: [
              ...(pipeline.commands || []),
              action.payload.data,
            ]
          }
        }
        return pipeline;
      }),
    }
  }
  if (action.type === PROJECT_DEFINES.DELETE_CONTAINER.FULFILLED) {
    return {
      ...state,
      target_clusters: state.target_clusters.map((cluster) => {
        if (cluster.namespace === action.payload.clusterNamespace) {
          return {
            ...cluster,
            containers: cluster.containers.filter(({name}) => name !== action.payload.name),
          }
        }
        return cluster;
      })
    }
  }
  // if (action.type === PROJECT_DEFINES.P)
  return state;
}

export default projectReducer;
