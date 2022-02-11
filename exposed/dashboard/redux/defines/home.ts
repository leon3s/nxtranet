import {defineAction} from '~/utils/redux';

export const GET_UPTIME = defineAction('HOME_GET_UPTIME');

export const GET_DISK_INFO = defineAction('HOME_GET_DISK_INFO');

export const GET_NETWORK_INTERFACES = defineAction('HOME_GET_NETWORK_INTERFACES');

export const GET_METRIX_NGINX_DOMAINS = defineAction('HOME_GET_METRIX_NGINX_DOMAINS');

export const GET_METRIX_NGINX_STATUS = defineAction('HOME_GET_METRIX_NGINX_STATUS');

export const GET_METRIX_NGINX_AVERAGE_RESPONSE_TIME = defineAction('HOME_GET_METRIX_NGINX_AVERAGE_RESPONSE_TIME');

export const GET_API_STATUS = defineAction('HOME_GET_API_STATUS');

export const GET_METRIX_NGINX_REQ = defineAction('HOME_GET_METRIX_NGINX_REQ');

export const GET_METRIX_CONTAINER_RUNNING = defineAction('HOME_GET_METRIX_CONTAINER_RUNNING');

export const GET_METRIX_CLUSTER_PRODUCTION = defineAction('HOME_GET_METRIX_CLUSTER_PRODUCTION');
