import net from 'net';

type ServerAddress = {
  address: string;
  family: string;
  port: number;
};

export async function getFreePort() {
  return new Promise<number>((resolve, reject) => {
    var srv = net.createServer();
    srv.listen(0, function() {
      const address = srv.address() as ServerAddress;
      srv.close((err) => {
        if (err) return reject(err);
        resolve(address.port);
      });
    });
  });
}