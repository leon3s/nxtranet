import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {PipelineStatusEnum} from '@nxtranet/headers';
import axios from 'axios';
import {client} from '../../../docker';
import {WebSockerServiceBindings} from '../keys';
import {Container} from '../models';
import {ClusterRepository, ContainerRepository} from '../repositories';
import {ContainerOutputRepository} from '../repositories/container-output.repository';
import {PipelineStatusRepository} from '../repositories/pipeline-status.repository';
import {WebsocketService} from '../websocket';

type ClusterDeployArgs = {
  namespace: string,
  commitSHA: string,
  branch: string,
  isProduction: boolean,
  isGeneratedDeploy: boolean
}

export
  class DockerService {

  _client: typeof client = client;

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

  connect = () => {
    this._client.connect();
  }

  disconnect = () => {
    this._client.disconnect();
  }

  startContainer = async (container: Container) => {
    await this._client.containersStart(container);
    this.clusterContainerStatus(container);
    await this.whenContainerReady(container);
  }

  syncContainers = async () => {
    const containersInfo = await this._client.containersInfo();
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
        const state = containerInfo.State as any;
        if (!container.state) {
          await this.containerRepository.state(container.namespace).create(state);
        } else {
          await this.containerRepository.state(container.namespace).patch(state);
        }
      }
    }));
  }

  clusterContainerRemove = async (container: Container) => {
    await this._client.containersRemove(container);
    await this.containerRepository.state(container.namespace).delete();
    await this.containerRepository.outputs(container.namespace).delete();
    await this.containerRepository.pipelineStatus(container.namespace).delete();
    return this.containerRepository.deleteById(container.id);
  }

  attachContainer = async (container: Container) => {
    this._client.containersAttach(container);
    this.clusterContainerStatus(container);
  }

  clusterContainerStatus = async (container: Container) => {
    this._client.watchContainersStatus(container, async (output) => {
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
          await axios.get(`http://${process.env.NXTRANET_DOCKER_HOST}:${container.appPort}`);
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

  clusterDeploy = async (args: ClusterDeployArgs): Promise<Container> => {
    const {
      namespace,
      branch,
      commitSHA,
      isProduction,
      isGeneratedDeploy,
    } = args;
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
    const partialContainer = await this._client.clustersDeploy({
      cluster,
      branch
    });
    partialContainer.commitSHA = commitSHA;
    partialContainer.gitBranchName = branch;
    partialContainer.isProduction = isProduction;
    partialContainer.projectName = cluster.projectName;
    partialContainer.isGeneratedDeploy = isGeneratedDeploy;
    const container = await this.containerRepository.create(partialContainer);
    this.clusterContainerStatus(container);
    return container;
  }
}
