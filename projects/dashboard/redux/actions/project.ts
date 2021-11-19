import { createAction } from '~/utils/redux';

import { PROJECT_DEFINES } from '../defines';

import type { AxiosResponse } from 'axios';
import type { State } from '../reducers';
import type {
  ModelProject,
  ModelEnvVar,
  ModelCluster,
  ModelPipeline,
  ModelContainer,
  ModelPipelineCmd,
  ModelContainerOutput,
} from '@nxtranet/headers';


export const get = createAction<[
], State, AxiosResponse<ModelProject>>(
  PROJECT_DEFINES.GET,
() =>
  ({}, {}, api) => {
    return api.get<ModelProject>('/projects');
});

export const post = createAction<[
  ModelProject,
], State, ModelProject>(
  PROJECT_DEFINES.POST,
  (project) =>
    ({}, {}, api) => {
      return api.post('/projects', project);
    }
)

export const getByName = createAction<[
  string,
], State, AxiosResponse<ModelProject>>(
  PROJECT_DEFINES.GET_BY_NAME,
(name:string) =>
  ({}, {}, api) => {
    return api.get<ModelProject>(`/projects/${name}`);
});

export const getClusters = createAction<[
  string,
  (string | undefined)?,
], State, AxiosResponse<ModelCluster>>(
  PROJECT_DEFINES.GET_CLUSTERS,
(projectName, clusterName) =>
  ({}, {}, api) => {
    return api.get<ModelCluster>(`/projects/${projectName}/clusters`, {
      params: {
        filter: {
            include: [
              {
                relation: "envVars",
              },
              {
                relation: "containers",
                scope: {
                  include: [
                    {
                      relation: "pipelineStatus",
                      scope: {
                        include: ["pipeline"]
                      }
                    }
                  ]
                }
          }],
          where: {
            name: clusterName,
          }
        }
      }
    })
  }
);

export const postClusters = createAction<[
  string,
  ModelCluster,
], State, ModelCluster>(
  PROJECT_DEFINES.POST_CLUSTERS,
  (projectName, cluster) =>
    ({}, {}, api) => {
      return api.post(`/projects/${projectName}/clusters`, cluster);
    }
)

export const clusterDeploy = createAction<[
  string,
  {branch:string}
], State, AxiosResponse<ModelCluster>>(
  PROJECT_DEFINES.CLUSTER_DEPLOY,
  (namespace, data) =>
    ({}, {}, api) => {
      return api.post<ModelCluster>(`/clusters/${namespace}/deploy`, data);
});

export const getContainers = createAction<[
  string,
  string,
], State, AxiosResponse<ModelContainer>>(
  PROJECT_DEFINES.GET_CONTAINERS,
  (projectName, containerName) =>
    ({}, {}, api) => {
      const include = ['cluster', {
        relation: 'pipelineStatus',
        scope: {
          include: ['pipeline'],
        },
      }];
      if (containerName) {
        include.push('outputs');
      }
      return api.get<ModelContainer>(`/projects/${projectName}/containers`, {
        params: {
          filter: {
            where: {
              name: containerName,
            },
            include,
          },
        },
      });
    }
)

export const containerStatus = createAction<[
  string,
], State, null>(
  PROJECT_DEFINES.CONTAINER_STATUS,
  (namespace) =>
    (dispatch, {}, api) => {
      api.socket.on(namespace, (output: ModelContainerOutput) => {
        dispatch({
          type: PROJECT_DEFINES.CONTAINER_STATUS.ON_EVENT,
          payload: output,
        });
      });
      return null;
    }
)

export const containerStatusOff = createAction<[
  string,
], State, null>(
  PROJECT_DEFINES.CONTAINER_STATUS,
  (namespace) =>
    ({}, {}, api) => {
      api.socket.removeAllListeners(namespace);
      return null;
    }
)

export const deleteContainer = createAction<[
  ModelContainer,
], State, {clusterNamespace:string, name:string}>(
  PROJECT_DEFINES.DELETE_CONTAINER,
  (container) =>
    async ({}, {}, api) => {
      const {
        name,
        clusterNamespace,
      } = container;
      await api.delete(`/clusters/${clusterNamespace}/containers/${name}`);
      return {
        name,
        clusterNamespace,
      }
    }
)

export const createEnvVar = createAction<[
  string,
  Partial<ModelEnvVar>
], State, AxiosResponse<ModelEnvVar>>(
  PROJECT_DEFINES.CREATE_ENV_VAR,
  (namespace, envVar) =>
    ({}, {}, api) => {
      return api.post<ModelEnvVar>(`/clusters/${namespace}/env-vars`, envVar);
});

export const getPipelines = createAction<[
  string
], State, AxiosResponse<ModelPipeline>>(
  PROJECT_DEFINES.GET_PIPELINES,
  (projectName) =>
    ({}, {}, api) => {
      return api.get<ModelPipeline>(`/projects/${projectName}/pipelines`, {
        params: {
          filter: {
            include: ["commands"],
          }
        }
      });
    }
)

export const createPipeline = createAction<[
  string,
  Partial<ModelPipeline>,
], State, AxiosResponse<ModelPipeline>>(
  PROJECT_DEFINES.CREATE_PIPELINE,
  (projectName, pipeline) =>
    ({}, {}, api) => {
      return api.post<ModelPipeline>(`/projects/${projectName}/pipelines`, pipeline);
    }
)

export const createPipelineCmd = createAction<[
  string,
  Partial<ModelPipelineCmd>,
], State, AxiosResponse<ModelPipelineCmd>>(
  PROJECT_DEFINES.CREATE_PIPELINE_CMD,
  (namespace, pipelineCmd) =>
    ({}, {}, api) => {
      return api.post<ModelPipelineCmd>(`/pipelines/${namespace}/cmds`, pipelineCmd);
    }
)
