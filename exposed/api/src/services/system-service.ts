import {repository} from '@loopback/repository';
import {client} from '../../../../internal/system';
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

  waitConnection = async () => {
    await this._client.waitConnection();
  }

  getDiskInfo = () => this._client.diskInfo();

  getNetworkInterfaces = () => this._client.osNetworkInterfaces();

  getUptime = () => this._client.osUptime();
}
