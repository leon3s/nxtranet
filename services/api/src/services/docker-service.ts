import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {PipelineStatusEnum} from '@nxtranet/headers';
import axios from 'axios';
import type {Socket} from 'socket.io-client';
import {io} from 'socket.io-client';
import {WebSockerServiceBindings} from '../keys';
import {Cluster, Container} from '../models';
import {ClusterRepository, ContainerRepository} from '../repositories';
import {ContainerOutputRepository} from '../repositories/container-output.repository';
import {PipelineStatusRepository} from '../repositories/pipeline-status.repository';
import {WebsocketService} from '../websocket';

export type DockerContainerInfo = {
  Id: string,
  Created: number,
  State: {
    Status: 'exited' | 'running';
    Running: boolean;
    Paused: boolean;
    Restarting: boolean;
    OOMKilled: false;
    Dead: boolean;
    Pid: number;
    ExitCode: number;
    Error: string;
    StartedAt: Date;
    FinishedAt: Date;
  },
}

const socket = io('http://localhost:1243');

export
  class DockerService {
  private _socket: Socket = socket;

  constructor(
    @inject(WebSockerServiceBindings.WEBSOCKET_SERVICE)
    protected webSocketService: WebsocketService,
    @repository(ClusterRepository)
    protected clusterRepository: ClusterRepository,
    @repository(ContainerRepository)
    protected containerRepository: ContainerRepository,
    @repository(ContainerOutputRepository)
    protected containerOutputRepository: ContainerOutputRepository,
    @repository(PipelineStatusRepository)
    protected pipelineStatusRepository: PipelineStatusRepository,
  ) { }

  private _serviceEmitDeploy = (cluster: Cluster, branch: string): Promise<Container> =>
    new Promise((resolve, reject) => {
      this._socket.emit('/cluster/deploy', cluster, branch,
        (err: Error, container: Container) => {
          if (err) return reject(err);
          return resolve(container);
        });
    });

  private _serviceEmitRemove = (container: Container) => new Promise<void>((resolve, reject) => {
    this._socket.emit('/cluster/remove', container, (err: Error) => {
      if (err) return reject(err);
      return resolve();
    });
  });

  disconnect = () => {
    this._socket.disconnect();
  }

  private _emitStart = (container: Container) => {
    return new Promise<void>((resolve, reject) => {
      this._socket.emit('/containers/start', container, (err: Error) => {
        if (err) return reject(err);
        return resolve();
      });
    });
  }

  startContainer = async (container: Container) => {
    await this._emitStart(container);
    this.clusterContainerStatus(container);
    await this.whenContainerReady(container);
  }

  getContainersInfo = (): Promise<DockerContainerInfo[]> => {
    return new Promise((resolve, reject) => {
      this._socket.emit('/containers/info', (err: Error, containers: DockerContainerInfo[]) => {
        console.log({err, containers});
        if (err) return reject(err);
        resolve(containers);
      });
    });
  }

  syncContainers = async () => {
    const containersInfo = await this.getContainersInfo();
    await Promise.all(containersInfo.map(async (containerInfo) => {
      console.log(containerInfo);
      const container = await this.containerRepository.findOne({
        where: {
          dockerID: containerInfo.Id,
        },
        include: ['state'],
      });
      if (!container) {
        console.error('container isnt existing in database considere remove it! ', containerInfo);
      } else {
        if (!container.state) {
          await this.containerRepository.state(container.namespace).create(containerInfo.State);
        } else {
          await this.containerRepository.state(container.namespace).patch(containerInfo.State);
        }
      }
    }));
  }

  clusterContainerRemove = async (container: Container) => {
    await this._serviceEmitRemove(container);
    await this.containerRepository.state(container.namespace).delete();
    await this.containerRepository.outputs(container.namespace).delete();
    await this.containerRepository.pipelineStatus(container.namespace).delete();
    return this.containerRepository.deleteById(container.id);
  }

  attachContainer = async (container: Container) => {
    this._socket.emit('/container/attach', container);
    this.clusterContainerStatus(container);
  }

  clusterContainerStatus = async (container: Container) => {
    this._socket.on(container.namespace, async (output) => {
      if (output.type === 'pipelineStatus') {
        output.payload.containerNamespace = container.namespace;
        await this.pipelineStatusRepository.createOrUpdate(output.payload);
      }
      if (output.type === 'cmd') {
        const containerOuputDB = await this.containerOutputRepository.create({
          ...output.payload,
          containerNamespace: container.namespace,
        });
        this.webSocketService.io.emit(container.namespace, containerOuputDB);
      }
    });
  }

  whenContainerReady = (container: Container): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          await axios.get(`http://127.0.0.1:${container.appPort}`);
          const pipelineStatus = await this.containerRepository.pipelineStatus(container.namespace).get({
            fields: ['pipelineNamespace', 'containerNamespace', 'creationDate'],
          });
          await this.pipelineStatusRepository.createOrUpdate({
            ...pipelineStatus,
            value: PipelineStatusEnum.ONLINE,
          });
          clearInterval(interval);
          clearTimeout(timeout);
          resolve();
        } catch (e) {
        }
      }, 1000);
      const timeout = setTimeout(async () => {
        const pipelineStatus = await this.containerRepository.pipelineStatus(container.namespace).get({
          fields: ['pipelineNamespace', 'containerNamespace', 'creationDate'],
        });
        await this.pipelineStatusRepository.createOrUpdate({
          ...pipelineStatus,
          value: PipelineStatusEnum.FAILED,
        });
        clearInterval(interval);
        reject(new Error('Container timeout after 1200000ms.'));
      }, 1200000);
    });
  }

  clusterDeploy = async ({
    namespace, branch, isProduction, isGeneratedDeploy, commitSHA
  }: {namespace: string, commitSHA: string, branch: string, isProduction: boolean, isGeneratedDeploy: boolean}): Promise<Container> => {
    const cluster = await this.clusterRepository.findOne({
      where: {
        namespace,
      },
      include: ['envVars', {
        relation: 'project',
        scope: {
          include: [{
            relation: 'pipelines',
            scope: {
              include: ['commands'],
            }
          }],
        },
      }],
    });
    if (!cluster) throw new HttpErrors.NotFound('Cluster not found');
    const partialContainer = await this._serviceEmitDeploy(cluster, branch);
    partialContainer.commitSHA = commitSHA;
    partialContainer.gitBranchName = branch;
    partialContainer.isProduction = isProduction;
    partialContainer.isGeneratedDeploy = isGeneratedDeploy;
    const container = await this.containerRepository.create(partialContainer);
    this.clusterContainerStatus(container);
    return container;
  }
}
