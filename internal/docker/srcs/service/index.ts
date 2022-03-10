import type {Socket} from '@nxtranet/service';
import {Server} from "@nxtranet/service";
import type {Socket as SocketIoClient} from 'socket.io-client';
import {io} from 'socket.io-client';
import type {Stream} from "stream";
import type {
  ContainerStats,
  EventClustersDeploy,
  EventContainersAttach,
  EventContainersCreate,
  EventContainersInfo,
  EventContainersRemove,
  EventContainersStart,
  EventContainersStats,
  EventContainersStop
} from '../headers/docker.h';
import {
  host,
  port
} from '../shared/config';
import Events from '../shared/events';
import {
  createClusterContainer,
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
};

export const close = async () => {
  server.httpServer.close();
};

class ClientManager {
  client: Socket;
  containerSocks: Record<string, SocketIoClient> = {};
  containerStatsStreams: Record<string, Stream> = {};

  constructor(client: Socket) {
    this.client = client;
  }

  private generateUrl(port: number) {
    return `http://${process.env.NXTRANET_DOCKER_HOST || '127.0.0.1'}:${port}`;
  }

  disconnectContainerSocks = () => {
    Object.keys(this.containerSocks).forEach((key) => {
      const socket = this.containerSocks[key];
      socket.disconnect();
      this.containerSocks[key] = null;
    });
  };

  disconnectContainerStatsStream = () => {
    Object.keys(this.containerStatsStreams).forEach((key) => {
      const stream = this.containerStatsStreams[key];
      stream.removeAllListeners();
      this.containerStatsStreams[key] = null;
    });
  };

  disconnect = () => {
    this.disconnectContainerSocks();
  };

  listenDeployerAction = (containerSock: SocketIoClient, namespace: string) => {
    containerSock.on('action', (output) => {
      this.client.socket.emit(namespace, output);
    });
    containerSock.on('deployer_error', (err) => {
      console.error(err);
      this.client.socket.emit(`${namespace}_error`, err);
    });
  };

  listenContainerStats = async (Id: string) => {
    const container = getContainerById(Id);
    const stream: Stream = (await container.stats({stream: true}) as any);
    stream.on('data', (buffer) => {
      const stats: ContainerStats = JSON.parse(buffer.toString());
      this.client.socket.emit(`stat_${Id}`, stats);
    });
    this.containerStatsStreams[Id] = stream;
  };

  connectToContainer = (Id: string, namespace: string, port: number) => {
    const url = this.generateUrl(port);
    if (!this.containerSocks[url]) {
      const containerSock = this.containerSocks[url] = io(url);
      this.listenContainerStats(Id);
      this.listenDeployerAction(containerSock, namespace);
      return containerSock;
    }
    return this.containerSocks[url];
  };
}

server.io.onNewClient((client) => {
  let clientManager = new ClientManager(client);

  client.onDisconnect(() => {
    clientManager.disconnect();
    clientManager = null;
  });

  client.on<
    EventContainersCreate.payload,
    EventContainersCreate.response
  >(Events.containersCreate, async (payload) => {
    const container = await createContainer(payload);
    return container.inspect();
  });

  client.on<
    EventClustersDeploy.payload,
    EventClustersDeploy.response
  >(Events.clustersDeploy, (payload) => {
    const {cluster, branch, commitSHA} = payload;
    return new Promise(async (resolve, reject) => {
      const createResponse = await createClusterContainer(cluster, branch, commitSHA);
      const {
        containerInstance,
        containerApi: {
          namespace,
          dockerID,
          deployerPort,
        }
      } = createResponse;
      await containerInstance.start();
      const containerSock = clientManager.connectToContainer(dockerID, namespace, deployerPort);
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
      dockerID,
      deployerPort
    } = container;
    const containerSock = clientManager.connectToContainer(dockerID, namespace, deployerPort);
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
    const containerSock = clientManager.connectToContainer(dockerID, namespace, deployerPort);
    return new Promise((resolve, reject) => {
      containerSock.emit('/start', (err: Error) => {
        if (err) return reject(err);
        return resolve();
      });
    });
  });

  client.on<
    EventContainersStats.payload,
    EventContainersStats.response
  >(Events.containersStats, async (payload) => {
    const container = getContainerById(payload.Id);
    const stats = await container.stats({stream: false});
    return stats;
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
  >(Events.containersRemove, async (payload) => {
    await removeContainer(payload.Id);
  });
});
