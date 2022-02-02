import io from 'socket.io-client';
import type {Socket} from 'socket.io-client';

export default class Client {
  socket: Socket;

  constructor(opts: any) {
    this.socket = io(opts);
  }

  send = <T>(eventName: string, payload?: {}) => new Promise<T>((resolve, reject) => {
    this.socket.emit(eventName, payload || {}, (err: Error, response: T) => {
      if (err) return reject(err)
      return resolve(response);
    });
  });
}
