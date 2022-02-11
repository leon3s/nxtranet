import type {Socket} from 'socket.io-client';
import io from 'socket.io-client';

export default class Client {
  socket: Socket;

  constructor(opts: any) {
    this.socket = io(opts);
  }

  send = <P, R>(eventName: string, payload?: P) => new Promise<R>((resolve, reject) => {
    this.socket.emit(eventName, payload || {}, (err: Error, response: R) => {
      if (err) return reject(err)
      return resolve(response);
    });
  });
}
