import IoServer from 'socket.io';
import {ExtendedError} from 'socket.io/dist/namespace';
import {NextranetApi} from '../application';
import {WebSockerServiceBindings} from '../keys';

export interface WebsocketService {
  io: IoServer.Server;
}

const protectMiddleware = (fn: Function) =>
  (socket: IoServer.Socket, next: (err?: ExtendedError | undefined) => void) => {
    Promise.resolve(fn(socket))
      .then(() => next())
      .catch(next);
  }

const generateIoClass = (_io: IoServer.Server) => {
  class IoService implements WebsocketService {
    public io = _io;
  }
  return IoService;
}

export const webSocket = async (lb4App: NextranetApi, io: IoServer.Server) => {
  lb4App.service(generateIoClass(io), WebSockerServiceBindings.WEBSOCKET_SERVICE);
  // const authMiddleware = await auth(lb4App);
  // io.use(authMiddleware);
  io.on('connection', (socket) => {
    console.log('socket connected with id ', socket.id);

    socket.on('disconnect', () => {
      console.log('socket disconnected with id ', socket.id);
    });
  });
}
