import type IoServer from 'socket.io';
import type {ExtendedError} from 'socket.io/dist/namespace';
import type {NextranetApi} from '../application';

const protectMiddleware = (fn: Function) =>
  (socket: IoServer.Socket, next: (err?: ExtendedError | undefined) => void) => {
    Promise.resolve(fn(socket))
      .then(() => next())
      .catch(next);
  }

export interface WebsocketService {
  io: IoServer.Server;
}

export const webSocket = async (lb4App: NextranetApi, io: IoServer.Server) => {
  // const authMiddleware = await auth(lb4App);
  // io.use(authMiddleware);
  io.on('connection', (socket) => {
    socket.on('disconnect', () => {
    });
  });
}
