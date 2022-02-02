import {Server} from "@nxtranet/service";
import os from 'os';
import * as disk from './disk';

const port = +(process.env.PORT ?? 9877);
const server = new Server();

server.io.on('connection', (socket) => {
  console.log('new socket !', socket.id);
  socket.on('/os/network/interfaces', (callback) => {
    try {
      const networks = os.networkInterfaces();
      callback(null, networks);
    } catch (e) {
      callback(e);
    }
  });

  socket.on('/os/uptime', (callback) => {
    try {
      const uptime = os.uptime();
      callback(null, uptime);
    } catch (e) {
      callback(e);
    }
  });

  socket.on('/disk/info', (callback = () => { }) => {
    disk.getDiskInfo().then((disks) => {
      callback(null, disks);
    }).catch(callback);
  });
});

server.httpServer.listen(port, '127.0.0.1', () => {
  console.log(`nextranet system service started on port ${port}`);
});
