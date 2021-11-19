import net from 'net';

export type Domains = Record<string, number>;

class Proxy {
    protected domains: Domains;
    private _server: net.Server;

    constructor(domains: Domains) {
        this.domains = domains;
        this._createServer();
    }

    public listen(port:number) {
        this._server.listen(port);
    }

    public updateDomains(domains: Domains) {
        this.domains = domains;
    }

    private _createServer() {
        this._server = net.createServer(socket => {
            socket.on('data', message => {
                const serviceSocket = new net.Socket();
                const messageString = message.toString();
                console.log('-- GOT MESSAGE --\n', messageString, '-------------');
                const subdomain = messageString.replace(/([\s\S]*nextranet-domain: )(.*)[\s\S]*/gm, '$2');
                const port = this.domains[subdomain];
                if (!port) return socket.destroy();
                try {
                    serviceSocket.connect(port, '127.0.0.1', () => {
                        serviceSocket.write(message);
                    });
                } catch (e) {
                    serviceSocket.destroy();
                    socket.destroy();
                }
                serviceSocket.on('data', data => {
                    socket.write(data);
                });
            });
        });
    }
}

export default Proxy;
