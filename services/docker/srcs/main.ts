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
  const connectToContainer = (namespace: string, port: number) => {
    const containerSock = io(`http://172.17.0.1:${port}`);
    containerSock.on('action', (output) => {
      socket.emit(namespace, output);
    });
    containerSock.on('deployer_error', (err) => {
      console.error(err);
    });
    return containerSock;
  }

  socket.on('/cluster/deploy', async (cluster, branch, callback) => {
    try {
      const createResponse = await createContainer(cluster, branch);
      const {
        containerInstance,
        containerApi: {
          namespace,
          deployerPort,
        }
      } = createResponse;
      await containerInstance.start();
      const containerSock = connectToContainer(namespace, deployerPort);
      containerSock.emit('/github', cluster, branch, (err) => {
        if (err) return callback(err);
        callback(null, createResponse.containerApi);
      });
    } catch (e) {
      callback(e);
    }
  });

  socket.on('/container/attach', (container: ModelContainer) => {
    const {
      namespace,
      deployerPort
    } = container;
    const containerSock = connectToContainer(namespace, deployerPort);
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
      const {
        dockerID,
        namespace,
        deployerPort,
      } = container;
      await startContainer(dockerID);
      const containerSock = connectToContainer(namespace, deployerPort);
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

server.httpServer.listen(port, '127.0.0.1', () => {
  console.log(`nextranet docker service started on port ${port}`);
});
