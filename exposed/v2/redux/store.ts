import type {AxiosInstance, AxiosRequestConfig} from 'axios';
import axios from 'axios';
import type {Context} from 'next-redux-wrapper';
import {
  createWrapper, HYDRATE
} from 'next-redux-wrapper';
import type {AnyAction, CombinedState, Reducer} from 'redux';
import {
  applyMiddleware, createStore
} from 'redux';
import promise from 'redux-promise-middleware';
import thunk, {ThunkMiddleware} from 'redux-thunk';
import io, {Socket} from 'socket.io-client';
import type {State} from './reducers';
import reducers from './reducers';

const isProd = process.env.NODE_ENV === 'production';

const apiUrl = process.env.API_URL || 'http://api.nxtra.net';

declare module "axios" {
  export interface AxiosInstance {
    socket: Socket;
  }
}

type ApiOption = {
  baseURL: string;
  withCredentials: boolean;
  headers: {
    cookie?: null | undefined | string;
  }
} & AxiosRequestConfig;

const apiOpts: ApiOption = {
  baseURL: apiUrl,
  withCredentials: true,
  headers: {},
};

type AppContext = {
  ctx: {
    req: {
      headers: {
        cookie: string | null | undefined,
      }
    }
  }
} & Context;

const rootReducer = (state: State, action: AnyAction): State => {
  if (action.type === HYDRATE) {
    return state;
  }
  return reducers(state, action);
};

// create a makeStore function
const makeStore = (context: Context) => {
  const _context = context as AppContext;
  let cookie = '';
  if (_context.ctx && _context.ctx.req) {
    cookie = _context.ctx.req.headers.cookie || '';
    apiOpts.headers.cookie = cookie;
  }
  const apiInstance = axios.create(apiOpts);
  if (typeof window !== 'undefined') {
    apiInstance.socket = io(apiUrl);
  }
  return createStore(
    rootReducer as Reducer<CombinedState<State>>,
    applyMiddleware(
      thunk.withExtraArgument(apiInstance) as ThunkMiddleware<State, AnyAction, AxiosInstance>,
      promise,
    )
  );
};

export const wrapper = createWrapper<ReturnType<typeof makeStore>>(
  makeStore,
  {debug: typeof window !== 'undefined' && !isProd},
);
