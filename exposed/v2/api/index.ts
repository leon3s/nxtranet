import type {AxiosRequestConfig} from 'axios';
import axios from 'axios';
import {io, Socket} from 'socket.io-client';

declare module "axios" {
  export interface AxiosInstance {
    socket: Socket;
  }
}

export type ApiOption = {
  baseURL: string;
  withCredentials: boolean;
  headers: {
    cookie?: null | undefined | string;
  }
} & AxiosRequestConfig;

export const apiUrl = process.env.NXTRANET_DOMAIN ? `http://api.${process.env.NXTRANET_DOMAIN}` : 'http://api.nxtra.net';

const defaultApiOpts: ApiOption = {
  baseURL: apiUrl,
  withCredentials: true,
  headers: {},
};

const apiInstance = axios.create(defaultApiOpts);

export function updateApiInstance(apiOpts: ApiOption = defaultApiOpts, withSocket = false) {
  apiInstance.defaults.baseURL = apiOpts.baseURL;
  apiInstance.defaults.headers.common = apiOpts.headers;
  apiInstance.defaults.withCredentials = apiOpts.withCredentials;
  if (typeof window !== 'undefined' && withSocket) {
    apiInstance.socket = io(apiUrl);
  }
  return apiInstance;
}

export default apiInstance;
