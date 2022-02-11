import {client, service} from '../srcs';

const testConfig = 'address=/test.com/127.0.0.1';

describe('Tests service dnsmasq', () => {

  beforeAll(async () => {
    await service.prepare();
    client.connect();
  });

  it('It should sync the config', async () => {
    await client.configSync({
      filecontent: testConfig,
    });
  });

  it('It should read the config', async () => {
    const config = await client.configRead();
    expect(config).toBe(testConfig);
  });

  it('It should restart the service', async () => {
    await client.restart();
  });

  afterAll(async () => {
    await service.close();
    client.disconnect();
  });
});
