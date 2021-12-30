import {repository} from '@loopback/repository';
import io, {Socket} from 'socket.io-client';
import {ContainerRepository} from '../repositories';

type PortProduction = {
  app: number;
  listen: number;
}

export
  class SubdomainService {

  protected socket: Socket;

  constructor(
    @repository(ContainerRepository)
    protected containerRepository: ContainerRepository,
  ) {
    this.socket = io('http://localhost:7898');
    this.socket.on('connect', () => {
      console.log('domain connected !');
      this.ready().then(() => {
        console.log('ready success');
      }).catch((err) => {
        console.error('ready error', err);
      });
    });
  }

  ready = async () => {
    const domains = await this.formatDomains();
    this.socket.emit('/domains/ready', domains);
  }

  updateDomains = async () => {
    const domains = await this.formatDomains();
    this.socket.emit('/domains/update', domains);
  }

  productionDomains = (ports: PortProduction[]) => {
    this.socket.emit('/domains/production', ports)
  }

  disconnect = () => {
    this.socket.disconnect();
  }

  formatDomains = async () => {
    const containers = await this.containerRepository.find();
    const data = containers.reduce((acc: Record<string, number>, container) => {
      acc[container.namespace.toLowerCase()] = container.appPort;
      return acc;
    }, {});
    return data;
  }
}
