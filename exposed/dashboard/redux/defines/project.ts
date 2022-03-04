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

export const PATCH_PROJECT = defineAction('PROJECT_PATCH_PROJECT');

export const PATCH_MODEL_PIPELINE_CMD = defineAction('PROJECT_PATCH_MODEL_PIPELINE_CMD');

export const METRIX_DOMAIN_NAME_PATH = defineAction('PROJECT_METRIX_DOMAIN_NAME_PATH');

export const METRIX_DOMAIN_NAME_STATUS = defineAction('PROJECT_METRIX_DOMAIN_NAME_STATUS');

export const METRIX_DOMAIN_NAME_ART = defineAction('PROJECT_METRIX_DOMAIN_NAME_ART');

export const METRIX_DOMAIN_NAME_REQ_COUNT = defineAction('PROJECT_METRIX_DOMAIN_NAME_REQ_COUNT');

export const CLUSTER_PIPELINE_CREATE_LINK = defineAction('PROJECT_CLUSTER_PIPELINE_CREATE_LINK');

export const CLUSTER_PIPELINE_DELETE_LINK = defineAction('PROJECT_CLUSTER_PIPELINE_DELETE_LINK');

export const CLUSTER_DELETE = defineAction('PROJECT_CLUSTER_DELETE');

export const PROJECT_OPEN_DELETE_MODAL = defineAction('PROJECT_OPEN_DELETE_MODAL');

export const PROJECT_CLOSE_DELETE_MODAL = defineAction('PROJECT_CLOSE_DELETE_MODAL');

export const DELETE = defineAction('PROJECT_DELETE');
