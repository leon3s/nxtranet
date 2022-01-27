import {repository} from '@loopback/repository';
import {ModelDisk} from '@nxtranet/headers';
import io, {Socket} from 'socket.io-client';
import {ContainerRepository} from '../repositories';


export
  class SystemService {

  protected _socket: Socket;

  constructor(
    @repository(ContainerRepository)
    protected containerRepository: ContainerRepository,
  ) {
    this._socket = io('http://localhost:9877');
    this._socket.on('connect', () => {
      console.log('system service connected !');
    });
    this._socket.on('disconnect', (reason) => {
      console.log('system service disconnected ', reason);
    });
  }

  getDiskInfo = () => new Promise<ModelDisk[]>((resolve, reject) => {
    this._socket.emit('/disk/info', (err: Error, diskInfos: ModelDisk[]) => {
      if (err) return reject(err);
      return resolve(diskInfos);
    });
  });
}
