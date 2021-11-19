import type {Socket} from 'socket.io';
import type {ExtendedError} from 'socket.io/dist/namespace';
import type {NextranetApi} from '../application';
import {User} from '../models';
import {TokenRepository, UserRepository} from '../repositories';

declare module 'socket.io' {
  interface Socket {
    _user?: User;
  }
}

export default async (lb4App: NextranetApi) => {
  const tokenRepo = await lb4App.getRepository(TokenRepository);
  const userRepository = await lb4App.getRepository(UserRepository);
  return (socket: Socket, next: (err?: ExtendedError | undefined) => void) => {
    return next();
    if (!socket.handshake.auth) return next();
    try {
      const {
        username,
        password,
      } = socket.handshake.auth;
      tokenRepo.findOne({
        where: {
          username: username.toString(),
          value: password.toString(),
        }
      }).then((token) => {
        if (!token) return next(new Error('Unauthorized'));
        userRepository.findOne({
          where: {
            username: token.username,
          },
        }).then((user) => {
          if (!user) return next(new Error('Token existing but User is not found.'));
          socket._user = user;
          next();
        })
      }).catch(() => {
        next();
        // next(new Error('Unauthorized'));
      })
    } catch (_e) {
      _e;
      next();
      // next(new Error('Unauthorized'));
    }
  }
}
