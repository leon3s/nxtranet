import {Server as WsServer} from 'socket.io';
import Socket from './Socket';

export default class Server {
  io: WsServer;

  constructor(opts: any) {
    this.io = new WsServer(opts);
  }

  onNewClient = (callback: (socket: Socket) => void) => {
    this.io.on('connect', (socket) => {
      callback(new Socket(socket));
    });
  }
}
