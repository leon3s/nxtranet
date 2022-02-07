import {Server} from "@nxtranet/service";
import * as dnsmasq from './dnsmasq';

const port = +(process.env.PORT ?? 3365);
const server = new Server();

const prepare = async () => {
  // await dnsmasq.start();
  return new Promise<void>((resolve) => {
    server.httpServer.listen(port, '127.0.0.1', () => {
      resolve();
    });
  });
}

server.io.on('connection', (socket) => {
  socket.on('/config/sync', (data: string, callback = () => { }) => {
    dnsmasq.syncConfig(data).then(() => {
      callback();
    }).catch(callback);
  });

  socket.on('/config/read', (callback = () => { }) => {
    dnsmasq.readConfig().then((config) => {
      callback(null, config);
    }).catch(callback);
  });

  socket.on('/start', (callback = () => { }) => {
    dnsmasq.start().then(() => {
      callback();
    }).catch(callback);
  });

  socket.on('/restart', (callback = () => { }) => {
    dnsmasq.restart().then(() => {
      callback();
    }).catch(callback);
  });
});

prepare().then(() => {
  console.log(`nextranet dnsmasq service ready on port ${port}`);
}).catch((err) => {
  console.error(err);
});
