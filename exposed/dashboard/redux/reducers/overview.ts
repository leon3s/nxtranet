import type {ReducerAction} from '~/utils/redux';
import type {ReducerHooks} from '~/utils/reducer';
import { createReducer } from '~/utils/reducer';
import { getNetworkInterfaces, getNginxArt, getNginxDomainsReqCount, getNginxReqCount, getNginxReqStatus, getUptime, GET_NETWORK_INTERFACES, GET_NGINX_ART, GET_NGINX_DOMAINS_REQ_COUNT, GET_NGINX_REQ_COUNT, GET_NGINX_REQ_STATUS, GET_UPTIME } from '../actions/overview';
import type { SystemNetworkInterfaces } from '@nxtranet/headers';
import { HYDRATE } from 'next-redux-wrapper';

export type OverviewState = {
  art: number;
  uptime: number;
  reqCount: number;
  networkInterfaces: SystemNetworkInterfaces;
  statusReqCount: any[];
  domainsReqCount: any[];
};

const initialState: OverviewState = {
  art: 0,
  uptime: 0,
  reqCount: 0,
  statusReqCount: [],
  domainsReqCount: [],
  networkInterfaces: {},
};

const reducerHooks: ReducerHooks<OverviewState> = {
  [HYDRATE]: (state, action) => ({
    ...state,
    art: action.payload.overview.art,
    uptime: action.payload.overview.uptime,
    reqCount: action.payload.overview.reqCount,
    statusReqCount: action.payload.overview.statusReqCount,
    domainsReqCount: action.payload.overview.domainsReqCount,
    networkInterfaces: action.payload.overview.networkInterfaces,
  }),
  [GET_UPTIME.FULFILLED]:
    (state, action: ReducerAction<typeof getUptime>) => ({
      ...state,
      uptime: action.payload.data,
    }),
  [GET_NETWORK_INTERFACES.FULFILLED]:
    (state, action: ReducerAction<typeof getNetworkInterfaces>) => ({
      ...state,
      networkInterfaces: action.payload.data,
    }),
  [GET_NGINX_ART.FULFILLED]:
    (state, action: ReducerAction<typeof getNginxArt>) => ({
      ...state,
      art: action.payload.data,
    }),
  [GET_NGINX_REQ_COUNT.FULFILLED]:
    (state, action: ReducerAction<typeof getNginxReqCount>) => ({
      ...state,
      reqCount: action.payload.data,
    }),
  [GET_NGINX_DOMAINS_REQ_COUNT.FULFILLED]:
    (state, action: ReducerAction<typeof getNginxDomainsReqCount>) => ({
      ...state,
      domainsReqCount: action.payload.data,
    }),
  [GET_NGINX_REQ_STATUS.FULFILLED]:
    (state, action: ReducerAction<typeof getNginxReqStatus>) => ({
      ...state,
      statusReqCount: action.payload.data,
    })
};

const reducer = createReducer<OverviewState>(initialState, reducerHooks);

export default reducer;
