import {Server} from "@nxtranet/service";
import * as disk from './disk';

const port = +(process.env.PORT ?? 9877);
const server = new Server();

server.io.on('connection', (socket) => {
  socket.on('/cpu/usage', () => {

  });

  socket.on('/cpu/info', () => {

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
