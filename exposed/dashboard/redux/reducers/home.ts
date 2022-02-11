import {MetrixNginxDomain, MetrixNginxStatus, SystemDisk, SystemNetworkInterfaces} from '@nxtranet/headers';
import type {AnyAction} from "redux";
import {HOME_DEFINES} from '../defines';

export type HomeState = {
  uptime: number;
  diskInfo: SystemDisk[];
  art: number;
  networkInterfaces: SystemNetworkInterfaces;
  clusterProductionCount: number;
  containerRunningCount: number;
  nginxReqCount: number;
  metrixNginxDomains: MetrixNginxDomain[];
  metrixNginxStatus: MetrixNginxStatus[];
}

type FN_PTRS = Record<
  string,
  (state: HomeState, action: AnyAction) =>
    HomeState>;

const fnPtrs: FN_PTRS = {
  [HOME_DEFINES.GET_UPTIME.FULFILLED]: (state, action) => {
    return {
      ...state,
      uptime: action.payload.data,
    };
  },
  [HOME_DEFINES.GET_DISK_INFO.FULFILLED]: (state, action) => {
    return {
      ...state,
      diskInfo: action.payload.data,
    }
  },
  [HOME_DEFINES.GET_NETWORK_INTERFACES.FULFILLED]: (state, action) => {
    return {
      ...state,
      networkInterfaces: action.payload.data,
    };
  },
  [HOME_DEFINES.GET_METRIX_NGINX_AVERAGE_RESPONSE_TIME.FULFILLED]: (state, action) => {
    return {
      ...state,
      art: action.payload.data,
    }
  },
  [HOME_DEFINES.GET_METRIX_CONTAINER_RUNNING.FULFILLED]: (state, action) => {
    return {
      ...state,
      containerRunningCount: action.payload.data,
    }
  },
  [HOME_DEFINES.GET_METRIX_CLUSTER_PRODUCTION.FULFILLED]: (state, action) => {
    return {
      ...state,
      clusterProductionCount: action.payload.data,
    }
  },
  [HOME_DEFINES.GET_METRIX_NGINX_REQ.FULFILLED]: (state, action) => {
    return {
      ...state,
      nginxReqCount: action.payload.data,
    }
  },
  [HOME_DEFINES.GET_METRIX_NGINX_DOMAINS.FULFILLED]: (state, action) => {
    return {
      ...state,
      metrixNginxDomains: action.payload.data,
    };
  },
  [HOME_DEFINES.GET_METRIX_NGINX_STATUS.FULFILLED]: (state, action) => {
    return {
      ...state,
      metrixNginxStatus: action.payload.data,
    }
  }
};

const reducer = (state: HomeState = {
  uptime: 0,
  diskInfo: [],
  art: 0,
  networkInterfaces: {},
  clusterProductionCount: 0,
  containerRunningCount: 0,
  nginxReqCount: 0,
  metrixNginxDomains: [],
  metrixNginxStatus: [],
}, action: AnyAction): HomeState => {
  const fn = fnPtrs[action.type] || null;
  if (!fn) {
    console.error('Action called with no function to catch in reducer ! ', action);
    return state
  };
  return fn(state, action);
}

export default reducer;
