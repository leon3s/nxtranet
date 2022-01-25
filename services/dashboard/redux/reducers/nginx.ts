import { AnyAction } from "redux";

import { NGINX_DEFINES } from "../defines";

import type { NginxSiteAvaible } from "@nxtranet/headers";

export type NginxState = {
  data: NginxSiteAvaible[],
  target: null | NginxSiteAvaible;
}

const projectReducer = (state:NginxState = {
  data: [],
  target: null,
}, action: AnyAction): NginxState => {
  if (action.type === NGINX_DEFINES.GET_SITES_AVAIBLE.FULFILLED) {
    return {
      ...state,
      data: action.payload.data,
    }
  }
  return state;
}

export default projectReducer;
