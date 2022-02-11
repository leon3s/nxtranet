import {Server as WsServer} from 'socket.io';
import Socket from './Socket';

export default class Server {
  io: WsServer;

  constructor(opts: any) {
    this.io = new WsServer(opts);
  }

  onNewClient = (callback: (socket: Socket) => void) => {
    this.io.on('connect', (socket) => {
      let socketHook: Socket | null = new Socket(socket);
      socket.on('disconnect', () => {
        socketHook = null;
      });
      callback(socketHook);
    });
  }
}
