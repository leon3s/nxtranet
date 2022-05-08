import {NginxAccessLog} from '@nxtranet/headers';
import {Client} from '@nxtranet/service';
import {
  EventMonitorAccessLog,
  EventReload,
  EventSiteAvailableDeploy,
  EventSiteDelete,
  EventSiteEnabledExists,
  EventSitesAvailable,
  EventSitesAvailableExists,
  EventSitesAvailableRead,
  EventSitesAvailableWrite,
  EventTest
} from '../headers/nginx.h';
import {
  host,
  port
} from '../shared/config';
import Events from '../shared/events';

let client: Client | null = null;

export function connect() {
  client = new Client(`http://${host}:${port}`);
  return client;
}

export function waitConnection() {
  return new Promise<void>((resolve) => {
    client.socket.on('connect', () => {
      resolve();
    });
  });
}

export function disconnect() {
  client.socket.disconnect();
}

export function sitesAvailable(
  payload: EventSitesAvailable.payload
): Promise<EventSitesAvailable.response> {
  return client.send<
    EventSitesAvailable.payload,
    EventSitesAvailable.response
  >(Events.sitesAvailable, payload);
}

export function sitesAvailableRead(
  payload: EventSitesAvailableRead.payload,
): Promise<EventSitesAvailableRead.response> {
  return client.send<
    EventSitesAvailableRead.payload,
    EventSitesAvailableRead.response
  >(Events.sitesAvailableRead, payload);
}

export function sitesAvailableWrite(
  payload: EventSitesAvailableWrite.payload,
): Promise<EventSitesAvailableWrite.response> {
  return client.send<
    EventSitesAvailableWrite.payload,
    EventSitesAvailableWrite.response
  >(Events.sitesAvailableWrite, payload);
}

export function sitesAvailableExists(
  payload: EventSitesAvailableExists.payload
): Promise<EventSitesAvailableExists.response> {
  return client.send<
    EventSitesAvailableExists.payload,
    EventSitesAvailableExists.response
  >(Events.sitesAvailableExists, payload);
}

export function sitesAvailableDeploy(
  payload: EventSiteAvailableDeploy.payload
): Promise<EventSiteAvailableDeploy.response> {
  return client.send<
    EventSiteAvailableDeploy.payload,
    EventSiteAvailableDeploy.response
  >(Events.sitesAvailableDeploy, payload);
}

export function sitesEnableExists(
  payload: EventSiteEnabledExists.payload
): Promise<EventSiteEnabledExists.response> {
  return client.send<
    EventSiteEnabledExists.payload,
    EventSiteEnabledExists.response
  >(Events.sitesEnabledExists, payload);
}

export function sitesDelete(
  payload: EventSiteDelete.payload,
): Promise<EventSiteDelete.response> {
  return client.send<
    EventSiteDelete.payload,
    EventSiteDelete.response
  >(Events.sitesDelete, payload);
}

export function test(
  payload: EventTest.payload
): Promise<EventTest.response> {
  return client.send<
    EventTest.payload,
    EventTest.response
  >(Events.test, payload);
}

export function reload(
  payload: EventReload.payload
): Promise<EventReload.response> {
  return client.send<
    EventReload.payload,
    EventReload.response
  >(Events.reload, payload);
}

export function monitorAccessLog(
  payload: EventMonitorAccessLog.payload
): Promise<EventMonitorAccessLog.response> {
  return client.send<
    EventMonitorAccessLog.payload,
    EventMonitorAccessLog.response
  >(Events.monitorAccessLog, payload);
}

export function watchAccessLog(
  callback: (err: Error | null, log: NginxAccessLog) => {}
): void {
  client.socket.on(Events.monitorAccessLogError, callback);
  client.socket.on(Events.monitorAccessLogNew, (log: NginxAccessLog) => {
    callback(null, log);
  })
}
