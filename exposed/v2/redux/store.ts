import type {AxiosInstance} from 'axios';
import type {Context} from 'next-redux-wrapper';
import {
  createWrapper
} from 'next-redux-wrapper';
import type {
  AnyAction,
  CombinedState,
  Reducer
} from 'redux';
import {
  applyMiddleware,
  createStore
} from 'redux';
import promise from 'redux-promise-middleware';
import thunk, {ThunkMiddleware} from 'redux-thunk';
import type {ApiOption} from '~/api';
import {apiUrl, updateApiInstance} from '~/api';
import type {State} from './reducers';
import reducers from './reducers';

const isProd = process.env.NODE_ENV === 'production';

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
  const apiInstance = updateApiInstance(apiOpts, true);
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
