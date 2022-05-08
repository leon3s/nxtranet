import cors from 'cors';
import {once} from 'events';
import express from 'express';
import http from 'http';
import io from 'socket.io';
import {ApplicationConfig, NextranetApi} from './application';
import {WebSockerServiceBindings} from './keys';
import {webSocket, WebsocketService} from './websocket';

export {ApplicationConfig};

const generateIoClass = (_io: io.Server) => {
  class IoService implements WebsocketService {
    public io = _io;
  }
  return IoService;
}

export class ServerApi {
  public readonly app: express.Application;
  public readonly lbApp: NextranetApi;
  private server: http.Server;
  public readonly io: io.Server;
  public port: number;
  public host: string;

  constructor(options: ApplicationConfig = {}) {
    this.app = express();
    this.port = options.rest.port;
    this.lbApp = new NextranetApi(options);
    this.server = http.createServer(this.app);
    this.app.use(cors(this.lbApp.restServer.config.cors));
    this.io = new io.Server(this.server, {
      cookie: true,
      httpCompression: true,
      cors: {
        origin: "*",
      }
    });
    this.lbApp.service(
      generateIoClass(this.io),
      WebSockerServiceBindings.WEBSOCKET_SERVICE,
    );
    this.app.enable('trust proxy');
    this.app.use('/', this.lbApp.requestHandler);
  }

  async boot() {
    await this.lbApp.boot();
  }

  public async start() {
    await this.lbApp.start();
    this.port = this.lbApp.restServer.config.port ?? 1444;
    this.host = this.lbApp.restServer.config.host ?? '127.0.0.1';
    this.server.listen(this.port, this.host);
    await webSocket(this.lbApp, this.io);
    await once(this.server, 'listening');
  }

  public async stop() {
    if (!this.server) return;
    await this.lbApp.stop();
    this.server.close();
    await once(this.server, 'close');
  }
}
