import {repository} from '@loopback/repository';
import {ModelDisk} from '@nxtranet/headers';
import type {NetworkInterfaceInfo} from 'os';
import io, {Socket} from 'socket.io-client';
import {ContainerRepository} from '../repositories';

export
  class SystemService {

  protected _socket: Socket;

  constructor(
    @repository(ContainerRepository)
    protected containerRepository: ContainerRepository,
  ) {
    if (!this._socket) {
      this._socket = io('http://localhost:9877');
      this._socket.on('connect', () => {
        console.log('system service connected !');
      });
      this._socket.on('disconnect', (reason) => {
        console.log('system service disconnected ', reason);
      });
    }
  }

  getDiskInfo = () => new Promise<ModelDisk[]>((resolve, reject) => {
    this._socket.emit('/disk/info', (err: Error, diskInfos: ModelDisk[]) => {
      if (err) return reject(err);
      return resolve(diskInfos);
    });
  });

  getNetworkInterfaces = () => new Promise<Record<string, NetworkInterfaceInfo[]>>((resolve, reject) => {
    this._socket.emit('/os/network/interfaces', (err: Error, networks: Record<string, NetworkInterfaceInfo[]>) => {
      if (err) return reject(err);
      return resolve(networks);
    })
  });

  getUptime = () => new Promise<number>((resolve, reject) => {
    this._socket.emit('/os/uptime', (err: Error, uptime: number) => {
      if (err) return reject(err);
      return resolve(uptime);
    })
  })
}
