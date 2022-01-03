import http from 'http';
import {Server} from 'socket.io';
import {io} from 'socket.io-client';
import {
  createContainer, removeContainer, stopContainer
} from './helpers/docker';

const port = +(process.env.PORT || 1243);

const requestListener = function (req, res) {
  res.writeHead(200);
  res.end(`nxt docker service running ${process.uptime()}`);
}

const httpServer = http.createServer(requestListener);
const server = new Server(httpServer);

server.on('connection', (socket) => {
  socket.on('/cluster/deploy', (cluster, branch, callback) => {
    createContainer(cluster, branch).then(async (createResonse) => {
      console.log(createResonse);
      callback(null, createResonse.containerApi);
      await createResonse.containerInstance.start();
      const dpSock = io(`http://localhost:${createResonse.containerApi.deployerPort}`);
      dpSock.emit('/github', cluster, branch, (err, res) => {
        dpSock.on(res.payload.statusUrl, (output) => {
          socket.emit(createResonse.containerApi.namespace, output);
        });
      });
    }).catch((err) => {
      console.log(err);
      callback(err);
    });
  });

  socket.on('/cluster/stop', (container, callback) => {
    stopContainer(container.dockerID)
      .then(() => {
        callback();
      }).catch(callback);
  });

  socket.on('/cluster/remove', (container, callback) => {
    removeContainer(container.dockerID)
      .then(() => {
        callback();
      }).catch(callback);
  });
});


httpServer.listen(port, () => {
  console.log(`nextranet docker service started on ${port}`);
});
