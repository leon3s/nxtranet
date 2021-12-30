import {fork} from 'child_process';
import type {Socket} from 'socket.io-client';
import {io} from 'socket.io-client';

const workerServerUrl = process.env._NXTWRKSRVURL || 'http://api.nextra.net';

export class Register {
  name: string;
  socket: Socket;

  constructor(name: string, token: string) {
    this.name = name;
    this.socket = io(workerServerUrl, {
      auth: {
        password: token,
        serviceName: name,
      }
    });
  }

  whenReady = async () => {
    return new Promise<void>((resolve) => {
      this.socket.on('connect', () => {
        this.socket.emit('/service', {
          type: 'info',
          payload: {
            env: process.env,
          }
        });
        resolve();
      });
    });
  }

  fork = (path: string) => {
    const child = fork(path, {
      env: {
        PATH: process.env.PATH,
        _NXTSRVPORT: '3231',
        _NXTSRVHOST: '0.0.0.0',
        _NXTSRVNAME: this.name,
        _NXTSRVSECRET: 'gfgd',
      }
    });
    child.stderr?.on('data', (data) => {
      this.socket.emit('/service', {
        type: 'cmd',
        payload: {
          stderr: data.toString(),
        }
      });
    });
    child.stdout?.on('data', (data) => {
      this.socket.emit('/service', {
        type: 'cmd',
        payload: {
          stderr: data.toString(),
        }
      });
    });
    child.on("exit", (code, signal) => {
      this.socket.emit('/service', {
        type: 'cmd',
        payload: {
          exitCode: code,
          signal: signal,
        }
      });
    });
  }
}
