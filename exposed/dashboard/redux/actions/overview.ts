import type { AxiosResponse } from 'axios';
import type { SystemNetworkInterfaces } from '@nxtranet/headers';
import {createAction, defineAction} from '~/utils/redux';
import type {State} from '../reducers';

export const GET_NETWORK_INTERFACES = defineAction('GET_NETWORK_INTERFACES');
export const getNetworkInterfaces = createAction<[
], State, AxiosResponse<SystemNetworkInterfaces>>(
  GET_NETWORK_INTERFACES, () =>
    ({}, {}, api) => api.get('/system/os/network/interfaces')
);

export const GET_UPTIME = defineAction('GET_UPTIME');
export const getUptime = createAction<[
], State, AxiosResponse<number>>(
  GET_UPTIME, () =>
    ({}, {}, api) => api.get('/system/os/uptime')
);

export const GET_NGINX_ART = defineAction('GET_NGINX_ART');
export const getNginxArt = createAction<[
], State, AxiosResponse<number>>(
  GET_NGINX_ART, () =>
    ({}, {}, api) => api.get('/metrix/nginx/art')
);

export const GET_NGINX_REQ_COUNT = defineAction('GET_NGINX_REQ_COUNT');
export const getNginxReqCount = createAction<[
], State, AxiosResponse<number>>(
  GET_NGINX_REQ_COUNT, () =>
    ({}, {}, api) => api.get('/metrix/nginx/req/count')
);

export const GET_NGINX_DOMAINS_REQ_COUNT = defineAction('GET_NGINX_DOMAINS_REQ_COUNT');
export const getNginxDomainsReqCount = createAction<[
], State, AxiosResponse<any[]>>(
  GET_NGINX_DOMAINS_REQ_COUNT, () =>
    ({}, {}, api) => api.get('/metrix/nginx/domains')
);

export const GET_NGINX_REQ_STATUS = defineAction('GET_NGINX_REQ_STATUS');
export const getNginxReqStatus = createAction<[
], State, AxiosResponse<any>>(
  GET_NGINX_REQ_STATUS, () =>
    ({}, {}, api) => api.get('/metrix/nginx/status')
);
