import {client, service} from '../srcs';



describe('Test system service', () => {

  beforeAll(async () => {
    await service.prepare();
    client.connect();
  });

  it('It should get network interfaces', async () => {
    const networkInterfaces = await client.osNetworkInterfaces();
    expect(networkInterfaces.lo[0].address).toBe('127.0.0.1');
  });

  it('It should get os uptime', async () => {
    const uptime = await client.osUptime();
    expect(uptime).toEqual(expect.any(Number));
  });

  it('It should get disk info', async () => {
    const diskInfo = await client.diskInfo();
    expect(diskInfo).toEqual(expect.any(Array));
  });

  afterAll(() => {
    client.disconnect();
    service.close();
  });
});
