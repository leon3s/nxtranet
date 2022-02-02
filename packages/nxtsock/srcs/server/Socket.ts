import type {Socket as IoSocket} from 'socket.io';
import {NxtsocketEvent} from '../headers/nxtsock.h';

function printEventError(eventName: string) {
  console.error('Event ' + eventName + ' call with wrong arguments');
}

export default class Socket {
  socket: IoSocket;

  constructor(socket: IoSocket) {
    this.socket = socket;
  }

  on = <T>(eventName: string, callback: NxtsocketEvent.Callback<T>) => {
    this.socket.on(eventName, (payload?: {}, res?: NxtsocketEvent.ResponseCallback) => {
      if (!payload) return printEventError(eventName);
      if (!res) return printEventError(eventName);
      const ret = callback(payload);
      if (ret instanceof Promise) {
        ret.then((response) => {
          res(null, response);
        }).catch((err) => {
          res(err);
        })
      }
    });
  }
}
