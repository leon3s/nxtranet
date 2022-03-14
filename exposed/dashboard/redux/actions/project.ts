import {
  ModelCluster,
  ModelContainer,
  ModelPipeline,
  ModelPipelineCmd,
  ModelProject
} from '@nxtranet/headers';
import type {AxiosResponse} from 'axios';
import Router from 'next/router';
import {createAction, defineAction} from '~/utils/redux';
import type {State} from '../reducers';

/** Action Used to create a project */
export const CREATE_PROJECT = defineAction('CREATE_PROJECT');
export const createProject = createAction<[
  Partial<ModelProject>
], State, AxiosResponse<ModelProject>>(
  CREATE_PROJECT, (project) =>
  ({ }, { }, api) => {
    return api.post('/projects', project);
  }
);

/** Action Used to delete a project by it's name */
export const DELETE_PROJECT_BY_NAME = defineAction('DELETE_PROJECT_BY_NAME');
export const deleteProjectByName = createAction<[
  string
], State, {name: string}>(
  DELETE_PROJECT_BY_NAME, (name) =>
  async ({ }, { }, api) => {
    await api.delete(`/projects/${name}`);
    await Router.push('/dashboard/projects');
    return {name};
  }
);

/** Action Used to get projects */
export const GET_PROJECTS = defineAction('GET_PROJECTS');
export const getProjects = createAction<[
], State, AxiosResponse<ModelProject[]>>(
  GET_PROJECTS, () =>
  ({ }, { }, api) => {
    /** We slow the request in purpose to have time to see animation. */
    /** LOL */
    return new Promise(async (resolve, reject) => {
      try {
        const res = await api.get<ModelProject[]>('/projects');
        setTimeout(() => {
          resolve(res);
        }, 1000);
      } catch (e) {
        setTimeout(() => {
          reject(e);
        }, 1000);
      }
    });
  }
);

export const GET_PROJECT_BY_NAME = defineAction('GET_PROJECT_BY_NAME');
export const getProjectByName = createAction<[
  string
], State, AxiosResponse<ModelProject>>(
  GET_PROJECT_BY_NAME, (name) =>
  ({ }, { }, api) =>
    api.get<ModelProject>(`/projects/${name}`, {
      params: {
        filter: {
          include: [{
            relation: 'clusters',
          }, {
            relation: 'pipelines',
          }],
        }
      }
    })
);

export const CREATE_PROJECT_CLUSTER = defineAction('CREATE_PROJECT_CLUSTER');
export const createProjectCluster = createAction<[
  string,
  ModelCluster,
], State, AxiosResponse<ModelCluster>>(
  CREATE_PROJECT_CLUSTER, (projectName, cluster) =>
  ({ }, { }, api) => {
    return api.post(`/projects/${projectName}/clusters`, cluster);
  }
);

export const GET_PROJECT_CLUSTER_BY_NAME = defineAction('GET_PROJECT_CLUSTER_BY_NAME');
export const getProjectClusterByName = createAction<[
  string,
  string,
  any,
], State, AxiosResponse<ModelCluster>>(
  GET_PROJECT_CLUSTER_BY_NAME, (projectName, clusterName, options) =>
  ({ }, { }, api) => {
    return api.get<ModelCluster>(`/projects/${projectName}/clusters/${clusterName}`, {
      ...(options || {}),
      params: {
        filter: {
          include: [
            {relation: 'pipelines'},
            {
              relation: 'containers',
              scope: {
                include: [
                  {
                    relation: 'pipelineStatus',
                    scope: {
                      include: ['pipeline'],
                    },
                  }
                ]
              }
            }
          ],
        }
      }
    });
  }
);

export const CLEAR_PROJECT_CLUSTER = defineAction('CLEAR_PROJECT_CLUSTER');
export const clearProjectCluster = createAction(
  CLEAR_PROJECT_CLUSTER,
  () => { },
);

export const CREATE_PROJECT_PIPELINE = defineAction('CREATE_PROJECT_PIPELINE');
export const createProjectPipeline = createAction<[
  string,
  Partial<ModelPipeline>,
], State, AxiosResponse<ModelPipeline>>(
  CREATE_PROJECT_PIPELINE,
  (projectName, pipeline) =>
    ({ }, { }, api) => {
      return api.post<ModelPipeline>(`/projects/${projectName}/pipelines`, pipeline);
    }
);

export const CREATE_PIPELINE_CMD = defineAction('CREATE_PIPELINE_CMD');
export const createPipelineCmd = createAction<[
  string,
  {cmd: string[]},
], State, AxiosResponse<ModelPipelineCmd>>(
  CREATE_PIPELINE_CMD,
  (namespace, {cmd}) =>
    ({ }, { }, api) => {
      const [name, ...args] = cmd;
      return api.post<ModelPipelineCmd>(`/pipelines/${namespace}/cmds`, {
        name,
        args,
      });
    }
);

export const GET_PROJECT_PIPELINE_BY_NAMESPACE = defineAction('GET_PROJECT_PIPELINE_BY_NAMESPACE');
export const getProjectPipelineByNamespace = createAction<[
  string,
  any,
], State, AxiosResponse<ModelPipeline>>(
  GET_PROJECT_PIPELINE_BY_NAMESPACE,
  (pipelineNamespace, options) =>
    ({ }, { }, api) => {
      return api.get<ModelPipeline>(`/pipelines/${pipelineNamespace}`, {
        ...(options || {}),
        params: {
          filter: {
            include: ["commands"],
          }
        }
      });
    }
);

export const CLEAR_PROJECT_PIPELINE = defineAction('CLEAR_PROJECT_PIPELINE');
export const clearProjectPipeline = createAction(
  CLEAR_PROJECT_PIPELINE,
  () => { },
);

export const DELETE_PIPELINE_CMD = defineAction('DELETE_PIPELINE_CMD');
export const deletePipelineCmd = createAction<[
  ModelPipelineCmd,
], State, ModelPipelineCmd>(
  DELETE_PIPELINE_CMD, (cmd) =>
  async ({ }, { }, api) => {
    await api.delete(`/pipelines/${cmd.pipelineNamespace}/cmds`, {
      params: {
        where: {id: cmd.id},
      }
    });
    return cmd;
  });

type ClusterPipelineLink = {
  clusterId: string;
  pipelineId: string;
}

export const CREATE_CLUSTER_PIPELINE_LINK = defineAction('CREATE_CLUSTER_PIPELINE_LINK');
export const createClusterPipelineLink = createAction<[
  ClusterPipelineLink,
], State, {clusterId: string, pipeline: ModelPipeline}>(
  CREATE_CLUSTER_PIPELINE_LINK,
  (link) =>
    async ({ }, { }, api) => {
      const {data: pipeline} = await api.post<ModelPipeline>(`/clusters/${link.clusterId}/pipelines/${link.pipelineId}/link`);
      return {
        clusterId: link.clusterId,
        pipeline,
      };
    });

export const DELETE_CLUSTER_PIPELINE_LINK = defineAction('DELETE_CLUSTER_PIPELINE_LINK');
export const deleteClusterPipelineLink = createAction<[
  ClusterPipelineLink,
], State, ClusterPipelineLink>(
  DELETE_CLUSTER_PIPELINE_LINK,
  (link) =>
    async ({ }, { }, api) => {
      await api.delete(`/clusters/${link.clusterId}/pipelines/${link.pipelineId}/link`);
      return link;
    });

export const CLUSTER_DEPLOY = defineAction('CLUSTER_DEPLOY');
export const clusterDeploy = createAction<[
  string,
  {branch?: string}?
], State, AxiosResponse<ModelContainer[]>>(
  CLUSTER_DEPLOY,
  (namespace, data) =>
    ({ }, { }, api) => {
      return api.post<ModelContainer[]>(`/clusters/${namespace}/deploy`, data);
    });

export const GET_PROJECT_CONTAINERS = defineAction('GET_PROJECT_CONTAINERS');
export const getProjectContainers = createAction<[
  string
], State, AxiosResponse<ModelContainer[]>>(
  GET_PROJECT_CONTAINERS, (name) =>
  ({ }, { }, api) => api.get<ModelContainer[]>(`/projects/${name}/containers`, {
    params: {
      filter: {
        include: [{
          relation: 'pipelineStatus',
          scope: {
            include: ['pipeline'],
          }
        }]
      }
    }
  })
);

export const GET_PROJECT_CONTAINER = defineAction('GET_PROJECT_CONTAINER');
export const getProjectContainer = createAction<[
  string,
  string
], State, AxiosResponse<ModelContainer>>(
  GET_PROJECT_CONTAINER, (projectName, containerName) =>
  ({ }, { }, api) => api.get(`/projects/${projectName}/containers/${containerName}`, {
    params: {
      filter: {
        include: ['cluster', {
          relation: 'pipelineStatus',
          scope: {
            include: ['pipeline'],
          },
        }, 'outputs']
      }
    }
  })
);

export const DELETE_CLUSTER_CONTAINER = defineAction('DELETE_CLUSTER_CONTAINER');
export const deleteClusterContainer = createAction<[
  ModelContainer
], State, ModelContainer>(
  DELETE_CLUSTER_CONTAINER, (container) =>
  async ({ }, { }, api) => {
    await api.delete(`/clusters/${container.clusterNamespace}/containers/${container.name}`);
    return container;
  }
);

export const GET_CONTAINER_METRIX_BY_NAME = defineAction('GET_CONTAINER_METRIX_BY_NAME');
export const getContainerMetrixByName = createAction<[
  string
], State, AxiosResponse<any>>(
  GET_CONTAINER_METRIX_BY_NAME, (name) =>
  ({ }, { }, api) => api.get(`/metrix/containers/${name}`)
);

export const DELETE_PROJECT_CLUSTER = defineAction('DELETE_PROJECT_CLUSTER');
export const deleteProjectCluster = createAction<[
  string,
  string
], State, Promise<string>>(
  DELETE_PROJECT_CLUSTER, (projectName, clusterId) =>
  async ({ }, { }, api) => {
    await api.delete(`/projects/${projectName}/clusters`, {
      params: {
        filter: {
          where: {
            id: clusterId,
          }
        }
      }
    })
    return clusterId;
  }
)
