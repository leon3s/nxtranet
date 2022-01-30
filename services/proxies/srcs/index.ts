import {Server} from "@nxtranet/service";
import DomainProxy from "./DomainProxy";
import Proxy from './Proxy';

type ProdPort = {
  listen: number,
  app: number,
};

const servicePort = 7898;
const port = +(process.env.PORT ?? 5454);
const server = new Server();

const domainProxy = new DomainProxy({});
const prodProxies: Record<number, Proxy> = {};

server.io.on('connection', (socket) => {
  socket.on('/domains/ready', (domains) => {
    domainProxy.updateDomains(domains);
  });

  socket.on('/domains/update', (domains) => {
    domainProxy.updateDomains(domains);
  });

  socket.on('/domains/production', (ports: ProdPort[]) => {
    console.log('/domains/production');
    Promise.all(ports.map(async (port) => {
      const listenPort = port.listen;
      const appPort = port.app;
      let proxy = prodProxies[listenPort];
      if (!proxy) {
        proxy = prodProxies[listenPort] = new Proxy(appPort);
        proxy.listen(listenPort, () => {
          console.log('proxy forwarding ' + listenPort + ' to ' + appPort);
        });
      } else {
        console.log('proxy existing, updating port ', appPort);
        proxy.updatePort(appPort);
      }
    }));
  });
});

domainProxy.listen(port, () => {
  console.log('Internal domain proxies listening on port ', port);
});

server.httpServer.listen(servicePort, '127.0.0.1', () => {
  console.log(`nextranet proxies service started on port ${servicePort}`);
});
