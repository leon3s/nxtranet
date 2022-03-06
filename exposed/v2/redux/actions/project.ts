import {defineAction} from '~/utils/redux';
import {createAction} from '~/utils/redux';

import type {AxiosResponse} from 'axios';
import type {
  ModelProject
} from '@nxtranet/headers';

import type { State } from '../reducers';

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
], State, AxiosResponse<ModelProject>>(
  DELETE_PROJECT_BY_NAME, (name) =>
    ({}, {}, api) => {
      return api.delete(`/projects/${name}`);
    }
);

/** Action Used to get projects */
const GET_PROJECTS = defineAction('GET_PROJECTS');
export const getProjects = createAction<[
], State, AxiosResponse<ModelProject[]>>(
  GET_PROJECTS, () =>
    ({}, {}, api) => {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await api.get<ModelProject[]>('/projects', {
            params: {
              filter: {
                // includes: [
                //   { relation: 'gitBranch' }
                // ]
              }
            }
          });
          setTimeout(() => {
            resolve(res);
          }, 1000);
        } catch (e) {
          reject(e);
        }
      });
    }
);

const DEFINES = {
  GET_PROJECTS,
  CREATE_PROJECT,
  DELETE_PROJECT_BY_NAME,
};

export default DEFINES;
