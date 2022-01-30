import net from 'net';

export type Domains = Record<string, number>;

class DomainProxy {
    protected domains: Domains;
    private _server: net.Server;

    constructor(domains: Domains) {
        this.domains = domains;
        console.log(this.domains);
        this._createServer();
    }

    public listen(port: number, callback = () => { }) {
        this._server.listen(port, '127.0.0.1', callback);
    }

    public updateDomains(domains: Domains) {
        this.domains = domains;
        console.log(this.domains);
    }

    private _createServer() {
        this._server = net.createServer(socket => {
            socket.on('data', message => {
                const serviceSocket = new net.Socket();
                const messageString = message.toString();
                console.log(messageString);
                const subdomain = messageString.replace(/([\s\S]*nextranet-domain: )(.*)[\s\S]*/gm, '$2');
                const port = this.domains[subdomain];
                if (!port) return socket.destroy();
                serviceSocket.connect(port, '127.0.0.1', () => {
                    serviceSocket.write(message);
                });
                serviceSocket.on('data', data => {
                    socket.write(data);
                });
                serviceSocket.once('error', (err) => {
                    console.log('err catched', err);
                    serviceSocket.destroy();
                    socket.destroy();
                });
            });
        });
    }
}

export default DomainProxy;
