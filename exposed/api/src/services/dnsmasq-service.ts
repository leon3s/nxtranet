import {repository} from '@loopback/repository';
import {client} from '../../../../internal/dnsmasq/dist';
import type {ClusterProduction, Container} from '../models';
import {ClusterProductionRepository, ClusterRepository} from '../repositories';

export class DnsmasqService {
  _client: typeof client = client;

  constructor(
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
    const clusters = await this.clusterRepository.find({
      include: ['production', 'containers'],
    });
    const data = clusters.reduce((acc, cluster) => {
      if (cluster.production) {
        acc += `address=/${cluster.production.domain}/${cluster.production.host}\n`;
      }
      acc += this.generateForContainers(cluster.containers || [], cluster.production);
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
