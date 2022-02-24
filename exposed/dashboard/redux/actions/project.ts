import type {
  ModelCluster, ModelClusterProduction, ModelContainer,
  ModelContainerOutput,
  ModelEnvVar,
  ModelPipeline,
  ModelPipelineCmd,
  ModelProject
} from '@nxtranet/headers';
import type {AxiosResponse} from 'axios';
import {createAction} from '~/utils/redux';
import {PROJECT_DEFINES} from '../defines';
import type {State} from '../reducers';

export const get = createAction<[
], State, AxiosResponse<ModelProject>>(
  PROJECT_DEFINES.GET,
  () =>
    ({ }, { }, api) => {
      return api.get<ModelProject>('/projects');
    });

export const post = createAction<[
  ModelProject,
], State, ModelProject>(
  PROJECT_DEFINES.POST,
  (project) =>
    ({ }, { }, api) => {
      return api.post('/projects', project);
    }
)

export const getByName = createAction<[
  string,
], State, AxiosResponse<ModelProject>>(
  PROJECT_DEFINES.GET_BY_NAME,
  (name: string) =>
    ({ }, { }, api) => {
      return api.get<ModelProject>(`/projects/${name}`, {
        params: {
          filter: {
            include: ['clusterProduction'],
          }
        }
      });
    });

export const getClusters = createAction<[
  string,
  (string | undefined)?,
], State, AxiosResponse<ModelCluster>>(
  PROJECT_DEFINES.GET_CLUSTERS,
  (projectName, clusterName) =>
    ({ }, { }, api) => {
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
    ({ }, { }, api) => {
      return api.post(`/projects/${projectName}/clusters`, cluster);
    }
)

export const clusterDeploy = createAction<[
  string,
  {branch?: string}?
], State, AxiosResponse<ModelContainer[]>>(
  PROJECT_DEFINES.CLUSTER_DEPLOY,
  (namespace, data) =>
    ({ }, { }, api) => {
      return api.post<ModelContainer[]>(`/clusters/${namespace}/deploy`, data);
    });

export const getContainers = createAction<[
  string,
  string,
], State, AxiosResponse<ModelContainer>>(
  PROJECT_DEFINES.GET_CONTAINERS,
  (projectName, containerName) =>
    ({ }, { }, api) => {
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
    (dispatch, { }, api) => {
      api.socket.on(namespace, (output: ModelContainerOutput) => {
        dispatch({
          type: PROJECT_DEFINES.CONTAINER_STATUS.ON_EVENT,
          payload: output,
        });
      });
      return null;
    }
)

export const createClusterProduction = createAction<[
  string,
  Partial<ModelClusterProduction>,
], State, AxiosResponse<ModelClusterProduction>>(
  PROJECT_DEFINES.CREATE_CLUSTER_PRODUCTION,
  (projectName, clusterProduction) =>
    ({ }, { }, api) =>
      api.post<ModelClusterProduction>(`/projects/${projectName}/cluster-production`, clusterProduction)
)

export const getClusterProduction = createAction<[
  string,
], State, AxiosResponse<ModelClusterProduction>>(
  PROJECT_DEFINES.GET_CLUSTER_PRODUCTION,
  (projectName) =>
    async ({ }, { }, api) => {
      try {
        const res = await api.get<ModelClusterProduction>(`/projects/${projectName}/cluster-production`)
        return res;
      } catch (err: any) {
        if (err.response.status !== 404) {
          throw err;
        }
        return {
          data: null,
        } as AxiosResponse<any>
      }
    }
)

export const patchClusterProduction = createAction<[
  string,
  Partial<ModelClusterProduction>
], State, AxiosResponse<ModelClusterProduction>>(
  PROJECT_DEFINES.PATCH_CLUSTER_PRODUCTION,
  (projectName, clusterProd) =>
    ({ }, { }, api) => {
      return api.patch(`/projects/${projectName}/cluster-production`, clusterProd);
    }
)

export const containerStatusOff = createAction<[
  string,
], State, null>(
  PROJECT_DEFINES.CONTAINER_STATUS,
  (namespace) =>
    ({ }, { }, api) => {
      api.socket.removeAllListeners(namespace);
      return null;
    }
)

export const deleteContainer = createAction<[
  ModelContainer,
], State, ModelContainer>(
  PROJECT_DEFINES.DELETE_CONTAINER,
  (container) =>
    async ({ }, { }, api) => {
      const {
        name,
        clusterNamespace,
      } = container;
      await api.delete(`/clusters/${clusterNamespace}/containers/${name}`);
      return container;
    }
)

export const deleteEnvVar = createAction<[
  ModelEnvVar,
], State, ModelEnvVar>(
  PROJECT_DEFINES.DELETE_ENV_VAR,
  (envVar) =>
    async ({ }, { }, api) => {
      await api.delete(`/clusters/${envVar.clusterNamespace}/env-vars`, {
        params: {
          where: {id: envVar.id},
        }
      });
      return envVar;
    })

export const createEnvVar = createAction<[
  string,
  Partial<ModelEnvVar>
], State, AxiosResponse<ModelEnvVar>>(
  PROJECT_DEFINES.CREATE_ENV_VAR,
  (namespace, envVar) =>
    ({ }, { }, api) => {
      return api.post<ModelEnvVar>(`/clusters/${namespace}/env-vars`, envVar);
    });

export const patchEnvVar = createAction<[
  ModelEnvVar,
], State, ModelEnvVar>(
  PROJECT_DEFINES.PATCH_ENV_VAR,
  (envVar) =>
    async ({ }, { }, api) => {
      await api.patch(`/clusters/${envVar.clusterNamespace}/env-vars`, envVar, {
        params: {
          where: {id: envVar.id},
        },
      });
      return envVar;
    }
)

export const getPipelines = createAction<[
  string
], State, AxiosResponse<ModelPipeline>>(
  PROJECT_DEFINES.GET_PIPELINES,
  (projectName) =>
    ({ }, { }, api) => {
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
    ({ }, { }, api) => {
      return api.post<ModelPipeline>(`/projects/${projectName}/pipelines`, pipeline);
    }
)

export const createPipelineCmd = createAction<[
  string,
  Partial<ModelPipelineCmd>,
], State, AxiosResponse<ModelPipelineCmd>>(
  PROJECT_DEFINES.CREATE_PIPELINE_CMD,
  (namespace, pipelineCmd) =>
    ({ }, { }, api) => {
      return api.post<ModelPipelineCmd>(`/pipelines/${namespace}/cmds`, pipelineCmd);
    }
)

export const patchPipelineCmd = createAction<[
  string,
  ModelPipelineCmd
], State, ModelPipelineCmd>(
  PROJECT_DEFINES.PATCH_MODEL_PIPELINE_CMD,
  (namespace, pipelineCmd) =>
    async ({ }, { }, api) => {
      await api.patch(`/pipelines/${namespace}/cmds`, pipelineCmd, {
        params: {
          where: {
            id: pipelineCmd.id,
          }
        }
      });
      return pipelineCmd;
    }
)

export const patchProject = createAction<[
  string,
  Partial<ModelProject>
], State, AxiosResponse<ModelProject>>(
  PROJECT_DEFINES.PATCH_PROJECT,
  (projectName, projectData) =>
    ({ }, { }, api) => {
      return api.patch(`/projects/${projectName}`, projectData);
    }
)

export const metrixDomainPath = createAction<[
  string
], State, AxiosResponse<any>>(
  PROJECT_DEFINES.METRIX_DOMAIN_NAME_PATH,
  (name) =>
    ({ }, { }, api) => {
      return api.get(`/metrix/nginx/domains/${name}/path`);
    })

export const metrixDomainStatus = createAction<[
  string
], State, AxiosResponse<any>>(
  PROJECT_DEFINES.METRIX_DOMAIN_NAME_PATH,
  (name) =>
    ({ }, { }, api) => {
      return api.get(`/metrix/nginx/domains/${name}/status`);
    })
