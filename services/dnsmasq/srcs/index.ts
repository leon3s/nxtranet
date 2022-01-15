import {Server} from "@nxtranet/service";
import fs from 'fs';

const port = +(process.env.PORT ?? 3365);
const server = new Server();

server.io.on('connection', (socket) => {
  socket.on('/config/sync', (data: string, callback = () => { }) => {
    fs.writeFileSync('/etc/dnsmasq.d/nextranet.domains', data);
  });

  socket.on('/config', (callback = () => { }) => {
    try {
      const domains = fs.readFileSync('/etc/dnsmasq.d/nextranet.domains').toString();
      callback(null, domains);
    } catch (err) {
      callback(err);
    }
  });
});

server.httpServer.listen(port, () => {
  console.log(`nextranet dnsmasq service started on port ${port}`);
});
