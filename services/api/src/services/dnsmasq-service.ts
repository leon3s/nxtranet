import {repository} from '@loopback/repository';
import {client} from '../../../dnsmasq';
import {ClusterProductionRepository} from '../repositories';

export class DnsmasqService {
  _client: typeof client = client;

  constructor(
    @repository(ClusterProductionRepository)
    protected clusterProductionRepository: ClusterProductionRepository,
  ) { }

  connect = () => {
    client.connect()
  }

  disconnect = () => {
    client.disconnect();
  }

  configSync = async () => {
    const clusterProds = await this.clusterProductionRepository.find();
    const data = clusterProds.reduce((acc, clusterProd) => {
      acc += `address=/${clusterProd.domain}/${process.env.NXTRANET_HOST}\n`;
      return acc;
    }, '');
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
