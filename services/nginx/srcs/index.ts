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
  return new Promise<void>((resolve) => {
    server.httpServer.listen(port, '127.0.0.1', () => {
      resolve();
    });
  });
}

server.io.on('connection', (socket) => {
  socket.on('/sites-available', (callback) => {
    try {
      const sitesAvaible = nginx.getSitesAvailable();
      callback(null, sitesAvaible);
    } catch (e) {
      callback(e);
    }
  });

  socket.on('/sites-available/read', (filename: string, callback) => {
    try {
      const content = nginx.readSiteAvailable(filename);
      callback(null, content);
    } catch (e) {
      callback(e);
    }
  });

  socket.on('/sites-available/write', (payload, callback) => {
    const {filename, content} = payload;
    try {
      nginx.writeSiteAvailable(filename, content);
      callback();
    } catch (e) {
      callback(e);
    }
  });

  socket.on('/sites-available/exists', (filename, callback) => {
    try {
      const exists = nginx.siteAvailableExists(filename);
      callback(null, exists);
    } catch (e) {
      callback(e);
    }
  });

  socket.on('/sites-enabled/exists', (filename, callback) => {
    try {
      const exists = nginx.siteEnabledExists(filename);
      callback(null, exists);
    } catch (e) {
      callback(e);
    }
  });

  socket.on('/sites-available/deploy', async (filename: string, callback) => {
    try {
      await nginx.deployConfig(filename);
      callback();
    } catch (err) {
      callback(err);
    }
  });

  socket.on('/monitor/access-log', () => {
    nginx.watchAccessLog((error, log) => {
      if (error) return socket.emit('/monitor/access-log/error');
      return socket.emit('/monitor/access-log/new', log);
    });
  });

  socket.on('/test', (callback) => {
    nginx.testConfig().then((res) => {
      callback(null, res);
    }).catch(callback);
  });

  socket.on('/restart', (callback) => {
    nginx.restartService().then(() => {
      callback();
    }).catch(callback);
  });

  socket.on('/reload', (callback) => {
    nginx.reloadService().then(() => {
      callback();
    }).catch(callback);
  });
});

prepare().then(() => {
  console.log(`nextranet nginx service ready on port ${port}`);
}).catch((err) => {
  console.error(err);
});
