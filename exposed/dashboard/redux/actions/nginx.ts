import {NginxSiteAvailable} from '@nxtranet/headers';
import type {AxiosResponse} from 'axios';
import {createAction, defineAction} from '~/utils/redux';
import type {State} from '../reducers';

export const GET_NGINX_SITES_AVAILABLE = defineAction('GET_NGINX_SITES_AVAILABLE');
export const getNginxSitesAvailable = createAction<[
], State, AxiosResponse<NginxSiteAvailable[]>>(
  GET_NGINX_SITES_AVAILABLE, () =>
  ({ }, { }, api) =>
    api.get('/nginx/sites-avaible')
);

export const SET_NGINX_SITE_AVAIBLE = defineAction('SET_NGINX_SITE_AVAIBLE');
export const setNginxSiteAvaible = createAction<[
  NginxSiteAvailable,
], State, NginxSiteAvailable>(
  SET_NGINX_SITE_AVAIBLE, (siteAvaible) => siteAvaible,
)
