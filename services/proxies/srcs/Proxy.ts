import net from 'net';

export default
  class Proxy {

  private _port: number;
  private _server: net.Server;

  constructor(port: number) {
    this._port = port;
    this._createSrv();
  }

  listen = (port: number, callback = () => { }) => {
    this._server.listen(port, callback);
  }

  updatePort = (port: number) => {
    this._port = port;
  }

  private _createSrv = () => {
    this._server = net.createServer((socket) => {
      const replaySock = new net.Socket();
      socket.on('data', (data) => {
        console.log(data.toString());
        try {
          replaySock.write(data);
        } catch (e) {
          replaySock.destroy();
          socket.destroy();
        }
      });
      replaySock.on('data', (data) => {
        console.log(data.toString());
        try {
          socket.write(data);
        } catch (e) {
          replaySock.destroy();
          socket.destroy();
        }
      });
      try {
        replaySock.connect(this._port, '127.0.0.1');
      } catch (e) {
        replaySock.destroy();
        socket.destroy();
        console.error(`Unable to replay request to port ${this._port}`);
      }
    });
  }
}
