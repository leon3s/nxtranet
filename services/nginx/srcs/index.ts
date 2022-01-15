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

  socket.on('/test', (callback) => {
    nginx.testConfig().then((res) => {
      callback(null, res);
    }).catch(callback);
  });

  socket.on('/restart', (callback) => {
    console.log('restart called !');
    nginx.restartService().then(() => {
      callback();
    }).catch(callback);
  });
});

server.httpServer.listen(port, () => {
  console.log(`nextranet nginx service started on port ${port}`);
});
