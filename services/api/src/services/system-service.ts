import {repository} from '@loopback/repository';
import {client} from '../../../system';
import {ContainerRepository} from '../repositories';


export
  class SystemService {

  _client: typeof client = client;

  constructor(
    @repository(ContainerRepository)
    protected containerRepository: ContainerRepository,
  ) { }

  connect = () => {
    this._client.connect();
  }

  disconnect = () => {
    this._client.disconnect();
  }

  getDiskInfo = () => this._client.diskInfo();

  getNetworkInterfaces = () => this._client.osNetworkInterfaces();

  getUptime = () => this._client.osUptime();
}
