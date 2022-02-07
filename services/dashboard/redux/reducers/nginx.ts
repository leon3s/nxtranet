import type {NginxSiteAvailable} from "@nxtranet/headers";
import {AnyAction} from "redux";
import {NGINX_DEFINES} from "../defines";



export type NginxState = {
  data: NginxSiteAvailable[],
  target: null | NginxSiteAvailable;
}

const projectReducer = (state: NginxState = {
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
