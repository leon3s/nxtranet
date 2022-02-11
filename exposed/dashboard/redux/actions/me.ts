import {AxiosResponse} from 'axios';
import {createAction} from '~/utils/redux';
import {ME_DEFINES} from '../defines';
import type {State} from '../reducers';

type IUser = {
  username: string;
  password: string;
  email: string;
}

type Crediential = {
  email: string;
  password: string;
}

export const whoiam = createAction<[], State, AxiosResponse<IUser>>(ME_DEFINES.WHOIAM, () =>
  ({ }, { }, api) => {
    return api.get<IUser>('/users/whoiam');
  });

export const login = createAction<[Crediential], State, AxiosResponse<IUser>>(ME_DEFINES.LOGIN, (credential) =>
  ({ }, { }, api) => {
    return api.post<IUser>('/users/login', credential);
  });
