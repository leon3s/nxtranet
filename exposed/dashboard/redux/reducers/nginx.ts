import type {NginxSiteAvailable} from '@nxtranet/headers';
import {HYDRATE} from 'next-redux-wrapper';
import type {ReducerHooks} from '~/utils/reducer';
import {createReducer} from '~/utils/reducer';
import {ReducerAction} from '~/utils/redux';
import {getNginxSitesAvailable, GET_NGINX_SITES_AVAILABLE, setNginxSiteAvaible, SET_NGINX_SITE_AVAIBLE} from '../actions/nginx';


export type NginxState = {
  files: NginxSiteAvailable[];
  current: NginxSiteAvailable | null;
};

const initialState: NginxState = {
  files: [],
  current: null,
};

const reducerHooks: ReducerHooks<NginxState> = {
  [HYDRATE]: (state, action) => ({
    ...state,
    files: action.payload.nginx.files,
    current: action.payload.nginx.current,
  }),
  [GET_NGINX_SITES_AVAILABLE.FULFILLED]:
    (state, action: ReducerAction<typeof getNginxSitesAvailable>) => ({
      ...state,
      files: action.payload.data,
    }),
  [SET_NGINX_SITE_AVAIBLE.DEFAULT]:
    (state, action: ReducerAction<typeof setNginxSiteAvaible>) => ({
      ...state,
      current: action.payload,
    })
};

const reducer = createReducer<NginxState>(initialState, reducerHooks);

export default reducer;
