import {Server} from "@nxtranet/service";
import * as nginx from './nginx';

const port = +(process.env.PORT || 3211);

const isProd = process.env.NODE_ENV === 'production';
const server = new Server();

if (!isProd) {
  server.app.get('/_debug', ({ }, res) => {
    res.send(JSON.stringify({
      username: require("os").userInfo().username,
      env: process.env,
    }));
  });
}

const prepare = async () => {
  // await nginx.startService();
  return new Promise<void>((resolve) => {
    server.httpServer.listen(port, '127.0.0.1', () => {
      resolve();
    });
  })
}

server.io.on('connection', (socket) => {
  socket.on('/sites-avaible', (callback) => {
    try {
      const sitesAvaible = nginx.getSitesAvaible();
      callback(null, sitesAvaible);
    } catch (e) {
      callback(e);
    }
  });

  socket.on('/sites-avaible/write', (payload, callback) => {
    const {filename, content} = payload;
    try {
      nginx.writeSiteAvaible(filename, content);
      callback();
    } catch (e) {
      callback(e);
    }
  });

  socket.on('/sites-avaible/deploy', async (filename: string, callback) => {
    console.log('sites-avaible/deploy')
    try {
      await nginx.deployConfig(filename);
      await nginx.reloadService();
      console.log('deploy and reload success');
      callback();
    } catch (err) {
      console.log('deploy and reload error ', err);
      callback(err);
    }

  });

  socket.on('/test', (callback) => {
    callback(null, '');
    // nginx.testConfig().then((res) => {
    //   callback(null, res);
    // }).catch(callback);
  });

  socket.on('/restart', (callback) => {
    console.log('restart called !');
    nginx.restartService().then(() => {
      callback();
    }).catch(callback);
  });

  socket.on('/reload', (callback) => {
    console.log('reload called !');
    nginx.reloadService().then(() => {
      console.log('reload success !');
      callback();
    }).catch(callback);
  });
});

prepare().then(() => {
  console.log(`nextranet nginx service ready on port ${port}`);
}).catch((err) => {
  console.error(err);
});
