import type {NginxSiteAvaible} from '@nxtranet/headers';
import type {Socket} from 'socket.io-client';
import {io} from 'socket.io-client';

export
  class NginxService {
  private _socket: Socket

  constructor(
  ) {
    this._socket = io('http://localhost:3211');
  }

  getSitesAvaible = (): Promise<NginxSiteAvaible[]> => {
    return new Promise<NginxSiteAvaible[]>((resolve, reject) => {
      this._socket.emit('/sites-avaible',
        (err: Error, data: NginxSiteAvaible[]) => {
          if (err) return reject(err);
          resolve(data);
        });
    });
  }

  writeSiteAvaible = (filename: string, content: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      this._socket.emit('/sites-avaible/write', {
        filename,
        content,
      }, (err: Error) => {
        if (err) return reject(err);
        resolve();
      })
    })
  }

  testConfig = (): Promise<{stderr:string, stdout:string}> => {
    return new Promise<{stderr:string, stdout:string}>((resolve, reject) => {
      this._socket.emit('/test', (err: Error, res: {stderr:string, stdout:string}) => {
        if (err) return reject(err);
        console.log(res);
        resolve(res);
      });
    });
  }

  restartService = (): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      this._socket.emit('/restart', (err: Error) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  disconnect = () => {
    this._socket.disconnect();
  }
}
