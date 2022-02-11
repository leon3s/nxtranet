import {Server, type Socket} from "@nxtranet/service";
import {io, type Socket as SocketIoClient} from 'socket.io-client';
import type {
  EventClustersDeploy,
  EventContainersAttach,
  EventContainersInfo,
  EventContainersRemove,
  EventContainersStart,
  EventContainersStop
} from '../headers/docker.h';
import {
  host,
  port
} from '../shared/config';
import Events from '../shared/events';
import {
  createContainer,
  getContainerById,
  getContainersInfo,
  removeContainer,
  startContainer,
  stopContainer
} from './helpers/docker';

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

class ClientManager {
  client: Socket;
  containerSocks: Record<string, SocketIoClient> = {};

  constructor(client: Socket) {
    this.client = client;
  }

  private generateUrl(port: number) {
    return `http://${process.env.NXTRANET_DOCKER_HOST || '127.0.0.1'}:${port}`;
  }

  disconnectContainers = () => {
    Object.keys(this.containerSocks).forEach((key) => {
      const socket = this.containerSocks[key];
      socket.disconnect();
    });
  }

  connectToContainer = (namespace: string, port: number) => {
    const url = this.generateUrl(port);
    if (!this.containerSocks[url]) {
      const containerSock = this.containerSocks[url] = io(url);
      containerSock.on('action', (output) => {
        this.client.socket.emit(namespace, output);
      });
      containerSock.on('deployer_error', (err) => {
        console.error(err);
        this.client.socket.emit(`${namespace}_error`, err);
      });
      return containerSock;
    }
    return this.containerSocks[url];
  }
}

server.io.onNewClient((client) => {
  let clientManager = new ClientManager(client);

  client.onDisconnect(() => {
    clientManager.disconnectContainers();
    clientManager = null;
  });

  client.on<
    EventClustersDeploy.payload,
    EventClustersDeploy.response
  >(Events.clustersDeploy, (payload) => {
    const {cluster, branch} = payload;
    return new Promise(async (resolve, reject) => {
      const createResponse = await createContainer(cluster, branch);
      const {
        containerInstance,
        containerApi: {
          namespace,
          deployerPort,
        }
      } = createResponse;
      await containerInstance.start();
      const containerSock = clientManager.connectToContainer(namespace, deployerPort);
      containerSock.emit('/github', cluster, branch, (err) => {
        if (err) return reject(err);
        resolve(createResponse.containerApi);
      });
    });
  });

  client.on<
    EventContainersAttach.payload,
    EventContainersAttach.response
  >(Events.containersAttach, async (container) => {
    const {
      namespace,
      deployerPort
    } = container;
    const containerSock = clientManager.connectToContainer(namespace, deployerPort);
    containerSock.emit('/attach');
  });

  client.on<
    EventContainersInfo.payload,
    EventContainersInfo.response
  >(Events.containersInfo, async () => {
    const containersInfo = await getContainersInfo();
    const containers = await Promise.all(containersInfo.map(async (containerInfo) => {
      return getContainerById(containerInfo.Id).inspect();
    }));
    return containers;
  });

  client.on<
    EventContainersStart.payload,
    EventContainersStart.response
  >(Events.containersStart, async (container) => {
    const {
      dockerID,
      namespace,
      deployerPort,
    } = container;
    await startContainer(dockerID);
    const containerSock = clientManager.connectToContainer(namespace, deployerPort);
    return new Promise((resolve, reject) => {
      containerSock.emit('/start', (err: Error) => {
        console.error({err});
        if (err) return reject(err);
        return resolve();
      });
    });
  });

  client.on<
    EventContainersStop.payload,
    EventContainersStop.response
  >(Events.containersStop, async (container) => {
    await stopContainer(container.dockerID);
  });

  client.on<
    EventContainersRemove.payload,
    EventContainersRemove.response
  >(Events.containersRemove, async (container) => {
    await removeContainer(container.dockerID);
  });
});
