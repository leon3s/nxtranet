import type {
  MetrixNginxDomain, MetrixNginxStatus,
  SystemDisk,
  SystemNetworkInterfaces
} from '@nxtranet/headers';
import type {AxiosResponse} from 'axios';
import {createAction} from '~/utils/redux';
import {HOME_DEFINES} from '../defines';
import type {State} from '../reducers';

export const getDiskInfo = createAction<[
], State, AxiosResponse<SystemDisk>>(
  HOME_DEFINES.GET_DISK_INFO,
  () =>
    ({ }, { }, api) => {
      return api.get<SystemDisk>('/system/disk/info');
    });

export const getUptime = createAction<[
], State, AxiosResponse<number>>(
  HOME_DEFINES.GET_UPTIME,
  () =>
    ({ }, { }, api) => api.get<number>('/system/os/uptime')
)

export const getNetworkInterfaces = createAction<[
], State, AxiosResponse<SystemNetworkInterfaces>>(
  HOME_DEFINES.GET_NETWORK_INTERFACES,
  () =>
    ({ }, { }, api) => api.get('/system/os/network/interfaces')
)

export const getAverageResponseTime = createAction<[
], State, AxiosResponse<number>>(
  HOME_DEFINES.GET_METRIX_NGINX_AVERAGE_RESPONSE_TIME,
  () =>
    ({ }, { }, api) => api.get('/metrix/nginx/average-response-time')
)

export const getMetrixNginxStatus = createAction<[
], State, AxiosResponse<MetrixNginxStatus>>(
  HOME_DEFINES.GET_METRIX_NGINX_STATUS,
  () =>
    ({ }, { }, api) => api.get('/metrix/nginx/status')
)

export const getMetrixNginxDomains = createAction<[
], State, AxiosResponse<MetrixNginxDomain>>(
  HOME_DEFINES.GET_METRIX_NGINX_DOMAINS,
  () =>
    ({ }, { }, api) => api.get('/metrix/nginx/domains')
)

export const getMetrixNginxReq = createAction<[
], State, AxiosResponse<number>>(
  HOME_DEFINES.GET_METRIX_NGINX_REQ,
  () =>
    ({ }, { }, api) => api.get('/metrix/nginx/req/count')
)

export const getMetrixContainerRunning = createAction<[
], State, AxiosResponse<number>>(
  HOME_DEFINES.GET_METRIX_CONTAINER_RUNNING,
  () =>
    ({ }, { }, api) => api.get('/metrix/docker/containers/count')
)

export const getMetrixClusterProduction = createAction<[
], State, AxiosResponse<number>>(
  HOME_DEFINES.GET_METRIX_CLUSTER_PRODUCTION,
  () =>
    ({ }, { }, api) => api.get('/metrix/cluster-production/count'),
)
