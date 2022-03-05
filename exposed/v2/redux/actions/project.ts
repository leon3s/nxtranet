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
  CREATE_PROJECT,
  (project) =>
    ({}, {}, api) => {
      return api.post('/projects', project);
    }
);

/** Action Used to delete a project by it's name */
const DELETE_PROJECT_BY_NAME = defineAction('DELETE_PROJECT_BY_NAME');
export const deleteProjectByName = createAction<[
  string
], State, AxiosResponse<ModelProject>>(
  DELETE_PROJECT_BY_NAME,
  (name) =>
    ({}, {}, api) => {
      return api.delete(`/projects/${name}`);
    }
);

const DEFINES = {
  CREATE_PROJECT,
  DELETE_PROJECT_BY_NAME,
};

export default DEFINES;
