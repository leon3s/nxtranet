import {repository} from '@loopback/repository';
import {client} from '../../../../internal/dnsmasq/dist';
import type {ClusterProduction, Container} from '../models';
import {ClusterProductionRepository, ClusterRepository, ProjectRepository} from '../repositories';

export class DnsmasqService {
  _client: typeof client = client;

  constructor(
    @repository(ProjectRepository) protected projectRepository: ProjectRepository,
    @repository(ClusterProductionRepository)
    protected clusterProductionRepository: ClusterProductionRepository,
    @repository(ClusterRepository) protected clusterRepository: ClusterRepository,
  ) { }

  connect = () => {
    client.connect()
  }

  disconnect = () => {
    client.disconnect();
  }

  generateForContainers = (containers: Container[], clusterProd?: ClusterProduction): string => {
    const mainDomain = clusterProd?.domain || process.env.NXTRANET_DOMAIN;
    return containers.reduce((acc, container) => {
      acc += `address=/${container.name}.${mainDomain}/${process.env.NXTRANET_HOST}\n`;
      return acc;
    }, '');
  }

  configSync = async () => {
    const projects = await this.projectRepository.find({
      include: ['clusterProduction', {
        relation: 'clusters',
        scope: {
          include: ['containers'],
        }
      }]
    });
    const data = projects.reduce((acc, project) => {
      const {clusterProduction, clusters} = project;
      if (clusterProduction) {
        acc += `address=/${clusterProduction.domain}/${clusterProduction.host}\n`;
      }
      acc += clusters.reduce((acc, cluster) => {
        acc += this.generateForContainers(cluster.containers || [], clusterProduction);
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
