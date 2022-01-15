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
        replaySock.write(data);
      });
      replaySock.on('data', (data) => {
        socket.write(data);
      });
      replaySock.connect(this._port);
      replaySock.once('error', (err) => {
        console.log('err catched ', err);
        socket.destroy();
        replaySock.destroy();
      });
    });
  }
}
