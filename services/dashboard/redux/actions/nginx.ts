import type {NginxSiteAvailable} from '@nxtranet/headers';
import type {AxiosResponse} from 'axios';
import {createAction} from '~/utils/redux';
import {NGINX_DEFINES} from '../defines';
import type {State} from '../reducers';

export const getSitesAvaible = createAction<[], State, AxiosResponse<NginxSiteAvailable>>(
  NGINX_DEFINES.GET_SITES_AVAIBLE,
  () =>
    ({ }, { }, api) => {
      return api.get<NginxSiteAvailable>('/nginx/sites-avaible');
    }
)
