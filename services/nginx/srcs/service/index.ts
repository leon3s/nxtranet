import {Server} from "@nxtranet/service";
import {EventMonitorAccessLog, EventReload, EventSiteAvailableDeploy, EventSiteDelete, EventSiteEnabledExists, EventSitesAvailable, EventSitesAvailableExists, EventSitesAvailableRead, EventSitesAvailableWrite, EventTest} from '../headers/nginx.h';
import {
  host, port
} from '../shared/config';
import Events from '../shared/events';
import * as nginx from './nginx';

const server = new Server();

export const prepare = async () => {
  return new Promise<void>((resolve) => {
    server.httpServer.listen(port, host, () => {
      resolve();
    });
  });
}

export const close = () => {
  server.httpServer.close();
}

server.io.onNewClient((client) => {
  client.on<
    EventSitesAvailable.payload,
    EventSitesAvailable.response
  >(Events.sitesAvailable, async () => {
    try {
      return nginx.getSitesAvailable();
    } catch (e) {
      throw e;
    }
  });

  client.on<
    EventSitesAvailableRead.payload,
    EventSitesAvailableRead.response
  >(Events.sitesAvailableRead, async (payload) => {
    const {filename} = payload;
    try {
      return nginx.readSiteAvailable(filename);
    } catch (e) {
      throw e;
    }
  });

  client.on<
    EventSitesAvailableWrite.payload,
    EventSitesAvailableWrite.response
  >(Events.sitesAvailableWrite, async (payload) => {
    const {filename, content} = payload;
    try {
      return nginx.writeSiteAvailable(filename, content);
    } catch (e) {
      throw e;
    }
  });

  client.on<
    EventSitesAvailableExists.payload,
    EventSitesAvailableExists.response
  >(Events.sitesAvailableExists, async (payload) => {
    const {filename} = payload;
    try {
      return nginx.siteAvailableExists(filename);
    } catch (e) {
      throw e;
    }
  });

  client.on<
    EventSiteAvailableDeploy.payload,
    EventSiteAvailableDeploy.response
  >(Events.sitesAvailableDeploy, async (payload) => {
    const {filename} = payload;
    await nginx.deployConfig(filename);
  });

  client.on<
    EventSiteEnabledExists.payload,
    EventSiteEnabledExists.response
  >(Events.sitesEnabledExists, async (payload) => {
    const {filename} = payload;
    try {
      return nginx.siteEnabledExists(filename);
    } catch (e) {
      throw e;
    }
  });

  client.on<
    EventSiteDelete.payload,
    EventSiteDelete.response
  >(Events.sitesDelete, async (payload) => {
    const {filename} = payload;
    await nginx.deleteSite(filename);
  });

  client.on<
    EventTest.payload,
    EventTest.response
  >(Events.test, async () => {
    return nginx.testConfig();
  });

  client.on<
    EventReload.payload,
    EventReload.response
  >(Events.reload, async () => {
    await nginx.reloadService();
  });

  client.on<
    EventMonitorAccessLog.payload,
    EventMonitorAccessLog.response
  >(Events.monitorAccessLog, async () => {
    nginx.watchAccessLog((error, log) => {
      if (error) return client.socket.emit(Events.monitorAccessLogError);
      return client.socket.emit(Events.monitorAccessLogNew, log);
    });
  });
});
