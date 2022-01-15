import {Server} from "@nxtranet/service";

const port = +(process.env.PORT ?? 9877);
const server = new Server();

server.io.on('connection', (socket) => {
  socket.on('/cpu/usage', () => {

  });

  socket.on('/cpu/info', () => {

  });

  socket.on('/disk/usage', () => {

  });

  socket.on('/disk/info', () => {

  });
});

server.httpServer.listen(port, () => {
  console.log(`nextranet system service started on port ${port}`);
});
