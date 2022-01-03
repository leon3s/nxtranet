import type {ModelCluster} from '@nxtranet/headers';
import path from 'path';
import type {Socket} from 'socket.io';
import {Server} from 'socket.io';
import Deployer from './Deployer';


const port = +(process.env.DP_SERVICE_PORT) || 1337;
const tmpDirPath = path.resolve(process.cwd(), 'tmp');

export const sockServ = new Server();

const deployer = new Deployer(tmpDirPath);

/**
 * @event connection
 * @param socket Socket;
 */
sockServ.on('connection', (socket: Socket) => {

  /**
   * @event connection
   * @param cluster ModelCluster;
   * @param branch string;
   * @param callback callback;
   */
  socket.on('/github', (cluster: ModelCluster, branch: string, callback) => {
    deployer.deploy(socket, cluster, branch).then((res) => {
      callback(null, res);
    }).catch((err) => {
      callback({
        status: 400,
        message: err.message,
      });
    });
  });
});

if (require.main === module) {
  sockServ.listen(port);
}

console.log('nextranet deployer service started at port ' + port);
