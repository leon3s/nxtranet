import {defineAction} from '~/utils/redux';

export const GET = defineAction('PROJECT_GET');

export const POST = defineAction('PROJECT_POST');

export const GET_BY_NAME = defineAction('PROJECT_GET_BY_NAME');

export const GET_CLUSTERS = defineAction('PROJECT_GET_CLUSTERS');

export const POST_CLUSTERS = defineAction('PROJECT_POST_CLUSTERS');

export const DELETE_CONTAINER = defineAction('PROJECT_DEL_CONTAINER');

export const GET_CONTAINERS = defineAction('PROJECT_GET_CONTAINERS');

export const CLUSTER_DEPLOY = defineAction('PROJECT_CLUSTER_DEPLOY');

export const CONTAINER_STATUS = defineAction('PROJECT_CONTAINER_STATUS');

export const CREATE_ENV_VAR = defineAction('PROJECT_CREATE_ENV_VAR');

export const GET_PIPELINES = defineAction('PRJECT_GET_PIPELINES');

export const CREATE_PIPELINE = defineAction('PROJECT_CREATE_PIPELINE');

export const CREATE_PIPELINE_CMD = defineAction('PROJECT_CREATE_PIPELINE_CMD');

export const DELETE_ENV_VAR = defineAction('PROJECT_DELETE_ENV_VAR');

export const PATCH_ENV_VAR = defineAction('PROJECT_PATH_ENV_VAR');

export const CREATE_CLUSTER_PRODUCTION = defineAction('PROJECT_CREATE_CLUSTER_PRODUCTION');

export const GET_CLUSTER_PRODUCTION = defineAction('PROJECT_GET_CLUSTER_PRODUCTION');
