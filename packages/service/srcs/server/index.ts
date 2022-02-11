import {Server as WsServer} from '@nxtranet/nxtsock';
import type {Express} from 'express';
import express from 'express';
import type {Server as HttpServer} from 'http';
import {createServer} from 'http';

export type {Socket} from '@nxtranet/nxtsock';

export class Server {
  public app: Express;
  public io: WsServer;
  public port: number;
  public host?: string;
  protected secret: string;
  public httpServer: HttpServer;

  constructor() {
    this.host = process.env._NXTSRVHOST;
    this.port = +(process.env._NXTSRVPORT || 2431);
    this.app = express();
    this.secret = process.env._NXTSRVSECRET || 's3cr3t';
    this.httpServer = createServer(this.app);
    this.io = new WsServer(this.httpServer);
    this.app.get('/', ({ }, res) => {
      res.send(JSON.stringify({
        uptime: process.uptime(),
      }));
    });
    if (process.env.NODE_ENV === 'development') {
      this.app.get('/_debug', ({ }, res) => {
        res.send(JSON.stringify({
          env: process.env,
        }));
      });
    }
  }
}
