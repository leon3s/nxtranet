import type {ModelCluster} from '@nxtranet/headers';
import path from 'path';
import type {Socket} from 'socket.io';
import {Server} from 'socket.io';
import Deployer from './Deployer';
import {readProjectCache} from './projectCache';

const tmpDirPath = path.resolve(process.cwd(), 'tmp');

export default class DeployerService {
  sockServ: Server;
  deployer: Deployer;

  constructor() {
    this.sockServ = new Server();
    this.deployer = new Deployer(tmpDirPath);
  }

  init = () => {
    this.sockServ.on('connection', (socket: Socket) => {
      const actionEmitter = (action) => {
        socket.emit('action', action);
      }

      const errorEmitter = (err) => {
        socket.emit('deployer_error', err);
      }

      socket.on('disconnect', () => {
        console.log('disconnected remove listenners');
        this.deployer.emitter.off('action', actionEmitter);
        this.deployer.emitter.off('error', errorEmitter);
        console.log('done');
      });

      socket.on('/github', (cluster: ModelCluster, branch: string, callback) => {
        this.deployer.emitter.on('action', actionEmitter);
        this.deployer.emitter.on('error', errorEmitter);
        this.deployer.deploy(cluster, branch).then((res) => {
          callback(null, res);
        }).catch((err) => {
          callback({
            status: 400,
            message: err.message,
          });
        });
      });

      socket.on('/start', (callback = () => { }) => {
        const cache = readProjectCache();
        if (!cache) {
          const err = new Error();
          err.message = 'No cache found considere deploy instead of restart.';
          return callback(err);
        }
        this.deployer.lastCommand = cache.cmd;
        this.deployer.projectDir = cache.projectPath;
        this.deployer.emitter.on('action', actionEmitter);
        this.deployer.emitter.on('error', errorEmitter);
        this.deployer.start(cache.cmd, cache.envVars, cache.projectPath);
        callback();
      });

      socket.on('/attach', () => {
        this.deployer.emitter.on('action', actionEmitter);
        this.deployer.emitter.on('error', errorEmitter);
      });
    });
  }

  listen = (port: number) => {
    this.sockServ.listen(port);
  }

  stop = () => {
    this.deployer.project.cancel();
    this.sockServ.close();
  }
}
