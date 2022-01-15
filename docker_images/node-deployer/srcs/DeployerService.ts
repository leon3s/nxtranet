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
      socket.on('/github', (cluster: ModelCluster, branch: string, callback) => {
        this.deployer.emitter.on('action', (action) => {
          socket.emit('action', action);
        });
        this.deployer.emitter.on('error', (err) => {
          socket.emit('deployer_error', err);
        });
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
          const err = new Error('No cache found considere deploy instead of restart.');
          return callback(err);
        }
        this.deployer.lastCommand = cache.cmd;
        this.deployer.projectDir = cache.projectPath;
        this.deployer.emitter.on('action', (action) => {
          socket.emit('action', action);
        });
        this.deployer.emitter.on('error', (err) => {
          socket.emit('deployer_error', err);
        });
        this.deployer.start(cache.cmd, cache.envVars, cache.projectPath);
        callback();
      });

      socket.on('/attach', () => {
        this.deployer.project.stdout.on('data', (stdout) => {
          socket.emit('action', {
            type: 'cmd',
            payload: {
              exe: this.deployer.lastCommand.name,
              cwd: this.deployer.projectDir,
              args: this.deployer.lastCommand.args,
              isLast: false,
              isFirst: false,
              stdout: stdout.toString(),
            }
          });
        });
        this.deployer.project.stderr.on('data', (stderr) => {
          socket.emit('action', {
            type: 'cmd',
            payload: {
              exe: this.deployer.lastCommand.name,
              cwd: this.deployer.projectDir,
              args: this.deployer.lastCommand.args,
              isLast: false,
              isFirst: false,
              stderr: stderr.toString(),
            }
          });
        });
        this.deployer.project.once('error', (err) => {
          console.error('deployer project once error: ', err);
        });
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
