import { createAction } from '~/utils/redux';

import { NGINX_DEFINES } from '../defines';

import type { AxiosResponse } from 'axios';
import type { State } from '../reducers';
import type { NginxSiteAvaible } from '@nxtranet/headers';

export const getSitesAvaible = createAction<[], State, AxiosResponse<NginxSiteAvaible>>(
  NGINX_DEFINES.GET_SITES_AVAIBLE,
  () =>
    ({}, {}, api) => {
      return api.get<NginxSiteAvaible>('/nginx/sites-avaible');
    }
)