/*
 *  ___   _   _ |  _|_ __  _     
 *  |__) [_] |_ |<  |_ |  [_] |\|
 * 
 * File: \redux\reducers\auth.ts
 * Project: dashboard
 * Created Date: Friday, 22nd October 2021 7:10:51 pm
 * Author: leone
 * -----
 * Last Modified: Mon Nov 15 2021
 * Modified By: leone
 * -----
 * Copyright (c) 2021 docktron
 * -----
 */

import { AnyAction } from "redux";

import { ME_DEFINES } from "../defines";

type ApiError = {
  name: string;
  message: string;
  statusCode: number;
}

type User = {
  id: string;
  email: string;
  username: string;
}

export type MeState = {
  me?: null | User;
  errors: {
    whoiam?: null | ApiError;
  };
}

const meReducer = (state:MeState = {
  errors: {},
}, action: AnyAction): MeState => {
  if (action.type === ME_DEFINES.WHOIAM.REJECTED) {
    return {
      ...state,
      me: null,
      errors: {
        whoiam: action.payload.response.data.error,
      },
    }
  }
  if (action.type === ME_DEFINES.LOGIN.FULFILLED) {
    return {
      ...state,
      me: action.payload.data,
    }
  }
  if (action.type === ME_DEFINES.WHOIAM.FULFILLED) {
    return {
      ...state,
      me: action.payload.data,
    }
  }
  return state;
}

export default meReducer;
