import {repository} from '@loopback/repository';
import {client} from '../../../../internal/dnsmasq/dist';
import type {Cluster, Container} from '../models';
import {ClusterRepository, ProjectRepository} from '../repositories';

export class DnsmasqService {
  _client: typeof client = client;

  constructor(
    @repository(ProjectRepository) protected projectRepository: ProjectRepository,
    @repository(ClusterRepository) protected clusterRepository: ClusterRepository,
  ) { }

  connect = () => {
    client.connect()
  }

  waitConnection = async () => {
    await this._client.waitConnection();
  }

  disconnect = () => {
    client.disconnect();
  }

  generateForContainers = (cluster: Cluster, containers: Container[]): string => {
    const mainDomain = cluster.hostname;
    return containers.reduce((acc, container) => {
      acc += `address=/${container.name}.${mainDomain}/${process.env.NXTRANET_HOST}\n`;
      return acc;
    }, '');
  }

  generateForCluster = (cluster: Cluster) => {
    return `address=/${cluster.hostname}/${cluster.host}\n`;
  }

  configSync = async () => {
    const projects = await this.projectRepository.find({
      include: [{
        relation: 'clusters',
        scope: {
          include: ['containers'],
        }
      }]
    });
    const data = projects.reduce((acc, project) => {
      const {clusters} = project;
      acc += (clusters || []).reduce((acc, cluster) => {
        acc += this.generateForCluster(cluster);
        acc += this.generateForContainers(cluster, cluster.containers || []);
        return acc;
      }, '');
      return acc;
    }, '')
    return this._client.configSync({
      filecontent: data,
    });
  }

  configRead = () => {
    return this._client.configRead();
  }

  restartService = () => {
    return this._client.restart();
  }
}
