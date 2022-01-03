import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import axios from 'axios';
import type {Socket} from 'socket.io-client';
import {io} from 'socket.io-client';
import {WebSockerServiceBindings} from '../keys';
import {Cluster, Container} from '../models';
import {ClusterRepository, ContainerRepository} from '../repositories';
import {ContainerOutputRepository} from '../repositories/container-output.repository';
import {PipelineStatusRepository} from '../repositories/pipeline-status.repository';
import {WebsocketService} from '../websocket';

export
  class DockerService {
  private _socket: Socket

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
  ) {
    this._socket = io('http://localhost:1243');
  }

  disconnect = () => {
    this._socket.disconnect();
  }

  _serviceEmitDeploy = (cluster: Cluster, branch: string): Promise<Container> =>
    new Promise((resolve, reject) => {
      this._socket.emit('/cluster/deploy', cluster, branch,
        (err: Error, container: Container) => {
          if (err) return reject(err);
          return resolve(container);
        });
    });

  _serviceEmitRemove = (container: Container) => new Promise<void>((resolve, reject) => {
    this._socket.emit('/cluster/remove', container, (err: Error) => {
      if (err) return reject(err);
      return resolve();
    });
  });

  clusterContainerRemove = async (namespace: string, name: string) => {
    const container = await this.containerRepository.findOne({
      where: {
        name,
        clusterNamespace: namespace,
      },
    });
    if (!container) throw new HttpErrors.NotFound('Container not found');
    await this._serviceEmitRemove(container);
    await this.containerOutputRepository.deleteAll({
      containerNamespace: container.namespace,
    });
    await this.pipelineStatusRepository.deleteAll({
      containerNamespace: container.namespace,
    });
    return this.containerRepository.deleteById(container.id);
  }

  clusterContainerStatus = async (namespace: string, name: string) => {
    const container = await this.containerRepository.findOne({
      where: {
        name,
        clusterNamespace: namespace,
      },
    })
    if (!container) throw new HttpErrors.NotFound('Container not found');
    this._socket.on(container.namespace, async (output) => {
      console.log('api receive output ', output);
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
    return new Promise<void>((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          await axios.get(`http://127.0.0.1:${container.appPort}`);
          clearInterval(interval);
          clearTimeout(timeout);
          resolve();
        } catch (e) {
        }
      }, 1000);
      const timeout = setTimeout(() => {
        clearInterval(interval);
        reject(new Error('Container timeout.'));
      }, 20000);
    });
  }

  clusterDeploy = async ({
    namespace, branch, isProduction, isGeneratedDeploy,
  }: {namespace: string, branch: string, isProduction: boolean, isGeneratedDeploy: boolean}): Promise<Container> => {
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
    partialContainer.gitBranchName = branch;
    partialContainer.isProduction = isProduction;
    partialContainer.isGeneratedDeploy = isGeneratedDeploy;
    const container = await this.containerRepository.create(partialContainer);
    this.clusterContainerStatus(cluster.namespace, container.name);
    return container;
  }
}
