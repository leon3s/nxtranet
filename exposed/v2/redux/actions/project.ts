import {
  ModelCluster,
  ModelPipeline,
  ModelPipelineCmd,
  ModelProject
} from '@nxtranet/headers';
import type {AxiosResponse} from 'axios';
import Router from 'next/router';
import {createAction, defineAction} from '~/utils/redux';
import type {State} from '../reducers';

/** Action Used to create a project */
const CREATE_PROJECT = defineAction('CREATE_PROJECT');
export const createProject = createAction<[
  Partial<ModelProject>
], State, AxiosResponse<ModelProject>>(
  CREATE_PROJECT, (project) =>
    ({}, {}, api) => {
      return api.post('/projects', project);
    }
);

/** Action Used to delete a project by it's name */
const DELETE_PROJECT_BY_NAME = defineAction('DELETE_PROJECT_BY_NAME');
export const deleteProjectByName = createAction<[
  string
], State, {name: string}>(
  DELETE_PROJECT_BY_NAME, (name) =>
    async ({}, {}, api) => {
      await api.delete(`/projects/${name}`);
      await Router.push('/dashboard/projects');
      return {name};
    }
);

/** Action Used to get projects */
const GET_PROJECTS = defineAction('GET_PROJECTS');
export const getProjects = createAction<[
], State, AxiosResponse<ModelProject[]>>(
  GET_PROJECTS, () =>
    ({}, {}, api) => {
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

const GET_PROJECT_BY_NAME = defineAction('GET_PROJECT_BY_NAME');
export const getProjectByName = createAction<[
  string
], State, AxiosResponse<ModelProject>>(
  GET_PROJECT_BY_NAME, (name) =>
    ({}, {}, api) =>
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

const CREATE_PROJECT_CLUSTER = defineAction('CREATE_PROJECT_CLUSTER');
export const createProjectCluster = createAction<[
  string,
  ModelCluster,
], State, AxiosResponse<ModelCluster>>(
  CREATE_PROJECT_CLUSTER, (projectName, cluster) =>
    ({}, {}, api) => {
      return api.post(`/projects/${projectName}/clusters`, cluster);
    }
);

const GET_PROJECT_CLUSTER_BY_NAME = defineAction('GET_PROJECT_CLUSTER_BY_NAME');
export const getProjectClusterByName = createAction<[
  string,
  string,
  any,
], State, AxiosResponse<ModelCluster>>(
  GET_PROJECT_CLUSTER_BY_NAME, (projectName, clusterName, options) =>
    async ({}, {}, api) => {
      return new Promise((resolve, reject) => {
        api.get<ModelCluster>(`/projects/${projectName}/clusters/${clusterName}`, options)
          .then(resolve).catch(reject);
      });
    }
);

const CLEAR_PROJECT_CLUSTER = defineAction('CLEAR_PROJECT_CLUSTER');
export const clearProjectCluster = createAction(
  CLEAR_PROJECT_CLUSTER,
  () => {},
);

const CREATE_PROJECT_PIPELINE = defineAction('CREATE_PROJECT_PIPELINE');
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

const CREATE_PIPELINE_CMD = defineAction('CREATE_PIPELINE_CMD');
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

const GET_PROJECT_PIPELINE_BY_NAMESPACE = defineAction('GET_PROJECT_PIPELINE_BY_NAMESPACE');
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

const CLEAR_PROJECT_PIPELINE = defineAction('CLEAR_PROJECT_PIPELINE');
export const clearProjectPipeline = createAction(
  CLEAR_PROJECT_PIPELINE,
  () => {},
);

const DELETE_PIPELINE_CMD = defineAction('DELETE_PIPELINE_CMD');
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

const DEFINES = {
  GET_PROJECTS,
  CREATE_PROJECT,
  GET_PROJECT_BY_NAME,
  CREATE_PIPELINE_CMD,
  CLEAR_PROJECT_PIPELINE,
  CLEAR_PROJECT_CLUSTER,
  DELETE_PIPELINE_CMD,
  GET_PROJECT_PIPELINE_BY_NAMESPACE,
  DELETE_PROJECT_BY_NAME,
  CREATE_PROJECT_PIPELINE,
  CREATE_PROJECT_CLUSTER,
  GET_PROJECT_CLUSTER_BY_NAME,
};

export default DEFINES;
