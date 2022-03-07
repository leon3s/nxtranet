import {
  ModelCluster,
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
      api.get<ModelProject>(`/projects/${name}`)
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

const DEFINES = {
  GET_PROJECTS,
  CREATE_PROJECT,
  GET_PROJECT_BY_NAME,
  DELETE_PROJECT_BY_NAME,
};

export default DEFINES;
