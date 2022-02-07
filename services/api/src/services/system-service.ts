import {repository} from '@loopback/repository';
import {SystemDisk} from '@nxtranet/headers';
import type {NetworkInterfaceInfo} from 'os';
import io, {Socket} from 'socket.io-client';
import {ContainerRepository} from '../repositories';

const socket: Socket = io('http://localhost:9877');

export
  class SystemService {

  protected _socket: Socket = socket;

  constructor(
    @repository(ContainerRepository)
    protected containerRepository: ContainerRepository,
  ) { }

  getDiskInfo = () => new Promise<SystemDisk[]>((resolve, reject) => {
    this._socket.emit('/disk/info', (err: Error, diskInfos: SystemDisk[]) => {
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
