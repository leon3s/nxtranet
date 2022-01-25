import {repository} from '@loopback/repository';
import type {Socket} from 'socket.io-client';
import io from 'socket.io-client';
import {ClusterProductionRepository} from '../repositories';

export class DnsmasqService {
  _socket: Socket;

  constructor(
    @repository(ClusterProductionRepository)
    protected clusterProductionRepository: ClusterProductionRepository,
  ) {
    this._socket = io('http://localhost:3365');
  }

  private _emitConfigSyncData = (data: string) => {
    return new Promise<void>((resolve, reject) => {
      this._socket.emit('/config/sync', data, (err: Error) => {
        if (err) return reject(err);
        return resolve();
      });
    });
  }

  configSync = async () => {
    const clusterProds = await this.clusterProductionRepository.find();
    const data = clusterProds.reduce((acc, clusterProd) => {
      acc += `address=/${clusterProd.domain}/127.0.0.1\n`;
      return acc;
    }, '');
    await this._emitConfigSyncData(data);
  }

  configRead = () => {
    return new Promise<string>((resolve, reject) => {
      this._socket.emit('/config/read', (err: Error, config: string) => {
        if (err) return reject(err);
        return resolve(config);
      });
    });
  }

  restartService = () => {
    return new Promise<void>((resolve, reject) => {
      this._socket.emit('/restart', (err: Error) => {
        if (err) return reject(err);
        return resolve();
      })
    });
  }

  startService = () => {
    return new Promise<void>((resolve, reject) => {
      this._socket.emit('/start', (err: Error) => {
        if (err) return reject(err);
        return resolve();
      })
    });
  }
}
