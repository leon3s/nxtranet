import type {
  ModelCluster,
  ModelContainer,
  ModelPipeline,
  ModelProject
} from '@nxtranet/headers';
import type {AnyAction} from "redux";
import {formCluster} from '~/forms/cluster';
import {formContainerDeploy} from '~/forms/container';
import {formEnvVar} from '~/forms/envVar';
import {removeModel, updateModel} from '~/utils/reducer';
import {PROJECT_DEFINES} from "../defines";

export type ProjectState = {
  data: ModelProject[],
  target: null | ModelProject;
  target_clusters: ModelCluster[];
  target_pipelines: ModelPipeline[];
  target_containers: ModelContainer[];
  target_metrix_domain_path: [];
  target_metrix_domain_status: [];
  target_metrix_domain_art: number;
  target_metrix_domain_req_count: number;
  form_cluster: typeof formCluster;
  form_container_deploy: typeof formContainerDeploy,
  form_env_var: typeof formEnvVar,
  modelProject: {
    isModalDeleteOpen: boolean;
    data?: ModelProject | null;
  }
}

type FN_PTRS = Record<
  string,
  (state: ProjectState, action: AnyAction) =>
    ProjectState>;

const fnPtrs: FN_PTRS = {
  [PROJECT_DEFINES.GET.FULFILLED]: (state, action) => {
    return {
      ...state,
      data: action.payload.data,
    }
  },
  [PROJECT_DEFINES.POST.FULFILLED]: (state, action) => {
    return {
      ...state,
      data: [
        action.payload.data,
        ...state.data,
      ]
    }
  },
  [PROJECT_DEFINES.GET_BY_NAME.FULFILLED]: (state, action) => {
    return {
      ...state,
      target: action.payload.data,
    }
  },
  [PROJECT_DEFINES.GET_CLUSTERS.FULFILLED]: (state, action) => {
    return {
      ...state,
      target_clusters: action.payload.data,
    }
  },
  [PROJECT_DEFINES.POST_CLUSTERS.FULFILLED]: (state, action) => {
    return {
      ...state,
      target_clusters: [
        ...state.target_clusters,
        action.payload.data,
      ],
    }
  },
  [PROJECT_DEFINES.GET_CONTAINERS.FULFILLED]: (state, action) => {
    return {
      ...state,
      target_containers: action.payload.data,
    }
  },
  [PROJECT_DEFINES.CONTAINER_STATUS.ON_EVENT]: (state, action) => {
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
  },
  [PROJECT_DEFINES.GET_PIPELINES.FULFILLED]: (state, action) => {
    return {
      ...state,
      target_pipelines: action.payload.data,
    }
  },
  [PROJECT_DEFINES.CREATE_PIPELINE.FULFILLED]: (state, action) => {
    return {
      ...state,
      target_pipelines: [
        ...state.target_pipelines,
        action.payload.data,
      ]
    }
  },
  [PROJECT_DEFINES.CREATE_PIPELINE_CMD.FULFILLED]: (state, action) => {
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
  },
  [PROJECT_DEFINES.DELETE_CONTAINER.FULFILLED]: (state, action) => {
    return {
      ...state,
      target_clusters: state.target_clusters.map((cluster) => {
        if (cluster.namespace === action.payload.clusterNamespace) {
          return {
            ...cluster,
            containers: removeModel(cluster.containers, action.payload),
          }
        }
        return cluster;
      }),
    }
  },
  [PROJECT_DEFINES.DELETE_ENV_VAR.FULFILLED]: (state, action) => {
    return {
      ...state,
      target_clusters: state.target_clusters.map((cluster) => {
        if (cluster.namespace === action.payload.clusterNamespace) {
          return {
            ...cluster,
            envVars: removeModel(cluster.envVars, action.payload),
          }
        }
        return cluster;
      }),
    }
  },
  [PROJECT_DEFINES.PATCH_ENV_VAR.FULFILLED]: (state, action) => {
    return {
      ...state,
      target_clusters: state.target_clusters.map((cluster) => {
        if (cluster.namespace === action.payload.clusterNamespace) {
          return {
            ...cluster,
            envVars: updateModel(cluster.envVars, action.payload),
          }
        }
        return cluster;
      }),
    }
  },
  [PROJECT_DEFINES.CREATE_ENV_VAR.FULFILLED]: (state, action) => {
    return {
      ...state,
      target_clusters: state.target_clusters.map((cluster) => {
        if (cluster.namespace === action.payload.data.clusterNamespace) {
          return {
            ...cluster,
            envVars: [
              ...(cluster.envVars || []),
              action.payload.data,
            ],
          };
        }
        return cluster;
      }),
    }
  },
  [PROJECT_DEFINES.METRIX_DOMAIN_NAME_PATH.FULFILLED]: (state, action) => {
    return {
      ...state,
      target_metrix_domain_path: action.payload.data,
    }
  },
  [PROJECT_DEFINES.METRIX_DOMAIN_NAME_STATUS.FULFILLED]: (state, action) => {
    return {
      ...state,
      target_metrix_domain_status: action.payload.data,
    }
  },
  [PROJECT_DEFINES.METRIX_DOMAIN_NAME_ART.FULFILLED]: (state, action) => {
    return {
      ...state,
      target_metrix_domain_art: action.payload.data,
    }
  },
  [PROJECT_DEFINES.METRIX_DOMAIN_NAME_REQ_COUNT.FULFILLED]: (state, action) => {
    return {
      ...state,
      target_metrix_domain_req_count: action.payload.data,
    }
  },
  [PROJECT_DEFINES.CLUSTER_PIPELINE_CREATE_LINK.FULFILLED]: (state, action) => {
    return {
      ...state,
      target_clusters: state.target_clusters.map((cluster) => {
        if (cluster.id === action.payload.clusterId) {
          return {
            ...cluster,
            pipelines: [
              ...(cluster.pipelines || []),
              action.payload.pipeline,
            ],
          }
        }
        return cluster;
      })
    };
  },
  [PROJECT_DEFINES.CLUSTER_PIPELINE_DELETE_LINK.FULFILLED]: (state, action) => {
    return {
      ...state,
      target_clusters: state.target_clusters.map((cluster) => {
        if (cluster.id === action.payload.clusterId) {
          return {
            ...cluster,
            pipelines: cluster.pipelines.filter(({id}) => id !== action.payload.pipelineId),
          };
        }
        return cluster;
      })
    };
  },
  [PROJECT_DEFINES.PATCH_MODEL_PIPELINE_CMD.FULFILLED]: (state, action) => {
    return {
      ...state,
      target_pipelines: state.target_pipelines.map((pipeline) => {
        if (pipeline.namespace === action.payload.pipelineNamespace) {
          return {
            ...(pipeline || {}),
            commands: (pipeline?.commands?.map((cmd) => {
              if (cmd.id === action.payload.id) {
                return action.payload;
              }
              return cmd;
            })) || [],
          }
        }
        return pipeline;
      })
    }
  },
  [PROJECT_DEFINES.CLUSTER_DELETE.FULFILLED]: (state, action) => {
    return {
      ...state,
      target_clusters: state.target_clusters.filter((cluster) => {
        return cluster.namespace !== action.payload.clusterNamespace;
      }),
    }
  },
  [PROJECT_DEFINES.PROJECT_OPEN_DELETE_MODAL.DEFAULT]: (state, action) => {
    return {
      ...state,
      modelProject: {
        isModalDeleteOpen: true,
        data: action.payload,
      }
    }
  },
  [PROJECT_DEFINES.PROJECT_CLOSE_DELETE_MODAL.DEFAULT]: (state) => {
    return {
      ...state,
      modelProject: {
        isModalDeleteOpen: false,
        data: null,
      }
    }
  }
}

const reducer = (state: ProjectState = {
  data: [],
  target: null,
  target_clusters: [],
  target_pipelines: [],
  target_containers: [],
  target_metrix_domain_path: [],
  target_metrix_domain_status: [],
  target_metrix_domain_art: 0,
  target_metrix_domain_req_count: 0,
  form_env_var: formEnvVar,
  form_cluster: formCluster,
  form_container_deploy: formContainerDeploy,
  modelProject: {
    isModalDeleteOpen: false,
    data: null,
  }
}, action: AnyAction): ProjectState => {
  const fn = fnPtrs[action.type] || null;
  if (!fn) {
    console.error('Action called with no function to catch in reducer ! ', action);
    return state
  };
  return fn(state, action);
}

export default reducer;
