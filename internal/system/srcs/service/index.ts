import {Server} from "@nxtranet/service";
import os from 'os';
import {
  EventDiskInfo,
  EventOsNetworkInterfaces,
  EventOsUptime
} from '../headers/system.h';
import {
  host,
  port
} from '../shared/config';
import Events from '../shared/events';
import * as disk from './disk';

const server = new Server();

export const prepare = async () => {
  return new Promise<void>((resolve) => {
    server.httpServer.listen(port, host, () => {
      resolve();
    });
  });
}

export const close = async () => {
  server.httpServer.close();
}

server.io.onNewClient((client) => {
  client.on<
    EventOsNetworkInterfaces.payload,
    EventOsNetworkInterfaces.response
  >(Events.osNetworkInterfaces, async () => {
    try {
      const networks = os.networkInterfaces();
      return networks;
    } catch (e) {
      throw e;
    }
  });

  client.on<
    EventOsUptime.payload,
    EventOsUptime.response
  >(Events.osUptime, async () => {
    try {
      const uptime = os.uptime();
      return uptime;
    } catch (e) {
      throw e;
    }
  });

  client.on<
    EventDiskInfo.payload,
    EventDiskInfo.response
  >(Events.diskInfo, async () => {
    return disk.getDiskInfo();
  });
});
