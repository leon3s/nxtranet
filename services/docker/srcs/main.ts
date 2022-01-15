import {
  ModelContainer
} from '@nxtranet/headers';
import {Server} from "@nxtranet/service";
import {io} from 'socket.io-client';
import {
  createContainer,
  getContainerById,
  getContainersInfo,
  removeContainer,
  startContainer,
  stopContainer
} from './helpers/docker';

const port = +(process.env.PORT || 1243);
const server = new Server();
// example of output stream
// createResponse.containerInstance.attach({
//   stream: true,
//   stdout: true,
//   stderr: true
// }, (err, stream) => {
//   // first 8 byte of stream are header
//   if (err) return console.error(err);
//   stream.on('data', (buffer: Buffer) => {
//     const fd = buffer[0];
//     const output = buffer.subarray(8).toString();
//     if (fd === 1) {
//       console.log(output);
//     }
//     if (fd === 2) {
//       console.error(output);
//     }
//   });
// });

server.io.on('connection', (socket) => {
  socket.on('/cluster/deploy', async (cluster, branch, callback) => {
    try {
      const createResponse = await createContainer(cluster, branch);
      await createResponse.containerInstance.start();
      const dpSock = io(`http://localhost:${createResponse.containerApi.deployerPort}`);
      dpSock.on('action', (output) => {
        socket.emit(createResponse.containerApi.namespace, output);
      });
      dpSock.emit('/github', cluster, branch, (err) => {
        if (err) return callback(err);
        callback(null, createResponse.containerApi);
      });
    } catch (e) {
      callback(e);
    }
  });

  socket.on('/container/attach', (containerData: ModelContainer) => {
    const containerSock = io(`http://localhost:${containerData.deployerPort}`);
    containerSock.on('action', (output) => {
      socket.emit(containerData.namespace, output);
    });
    containerSock.emit('/attach');
  });

  socket.on('/containers/info', async (callback = () => { }) => {
    try {
      const containersInfo = await getContainersInfo();
      const containers = await Promise.all(containersInfo.map(async (containerInfo) => {
        return getContainerById(containerInfo.Id).inspect();
      }));
      callback(null, containers);
    } catch (err) {
      callback(err);
    }
  });

  socket.on('/containers/start', async (container: ModelContainer, callback = () => { }) => {
    try {
      await startContainer(container.dockerID);
      const containerSock = io(`http://localhost:${container.deployerPort}`);
      containerSock.on('action', (action) => {
        socket.emit(container.namespace, action);
      });
      containerSock.emit('/start', (err: Error) => {
        if (err) {
          return callback(err);
        }
        callback();
      });
    } catch (err) {
      callback(err);
    }
  });

  socket.on('/cluster/stop', async (container, callback) => {
    try {
      await stopContainer(container.dockerID);
      callback();
    } catch (err) {
      callback(err);
    }
  });

  socket.on('/cluster/remove', async (container, callback) => {
    try {
      await removeContainer(container.dockerID);
      callback();
    } catch (err) {
      callback(err);
    }
  });
});

server.httpServer.listen(port, () => {
  console.log(`nextranet docker service started on port ${port}`);
});
