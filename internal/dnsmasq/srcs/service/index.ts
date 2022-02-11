import {Server} from "@nxtranet/service";
import {EventConfigRead, EventConfigSync, EventRestart} from '../headers/dnsmasq.h';
import {
  host,
  port
} from '../shared/config';
import Events from '../shared/events';
import * as dnsmasq from './dnsmasq';

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

server.io.onNewClient((socket) => {
  socket.on<
    EventConfigSync.payload,
    EventConfigSync.response
  >(Events.configSync, async (payload) => {
    await dnsmasq.syncConfig(payload.filecontent);
  });

  socket.on<
    EventConfigRead.payload,
    EventConfigRead.response
  >(Events.configRead, () => {
    return dnsmasq.readConfig();
  });

  socket.on<
    EventRestart.payload,
    EventRestart.response
  >(Events.restart, async () => {
    await dnsmasq.restart();
  });
});
