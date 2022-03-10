import type {Socket as IoSocket} from 'socket.io';
import type {NxtsocketEvent} from '../headers/nxtsock.h';

function printEventError(eventName: string) {
  console.error('Event ' + eventName + ' call with wrong arguments');
}

export default class Socket {
  socket: IoSocket;

  constructor(socket: IoSocket) {
    this.socket = socket;
  }

  on = <P = undefined, R = void>(eventName: string, callback: NxtsocketEvent.Callback<P, R>) => {
    this.socket.on(eventName, (payload?: P, res?: NxtsocketEvent.ResponseCallback) => {
      if (!payload) return printEventError(eventName);
      if (!res) return printEventError(eventName);
      try {
        const ret = callback(payload);
        if (ret instanceof Promise) {
          ret.then((response) => {
            res(null, response);
          }).catch((err) => {
            res(err, undefined);
          })
        }
      } catch (e) {
        res(e, undefined);
      }
    });
  }

  onDisconnect = (callback = (): void => { }) => {
    this.socket.on('disconnect', callback);
  }
}
