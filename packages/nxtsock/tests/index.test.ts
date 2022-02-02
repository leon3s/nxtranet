import {Client, Server} from '../srcs';

let server: Server;
let client: Client;

describe('Nxtsock tests', () => {

  beforeAll(() => {
    server = new Server(1555);
    client = new Client('http://127.0.0.1:1555');
  });

  it('should create an event /hello', () => {
    server.onNewClient((socket) => {
      socket.on<string>('/hello', async (payload) => {
        console.log(payload);
        return "hi";
      });
    });
  });

  it('should receive hi from server', async () => {
    const response = await client.send<string>('/hello');
    expect(response).toBe("hi");
  });

  afterAll(() => {
    server.io.close();
    client.socket.disconnect();
  })
});
