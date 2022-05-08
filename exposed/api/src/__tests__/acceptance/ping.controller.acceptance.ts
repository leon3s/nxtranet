import {Client, expect} from '@loopback/testlab';
import {setupApplication, setupServices, stopServices} from './test-helper';
import type {ServerApi} from '../..';

describe('PingController', () => {
  let server: ServerApi;
  let client: Client;

  before('setupApplication', async function () {
    this.timeout(50000);
    await setupServices();
    ({server, client} = await setupApplication());
  });

  after(async function () {
    this.timeout(50000);
    await stopServices();
    await server.stop();
  });

  it('invokes GET /ping', async function () {
    this.timeout(50000);
    const res = await client.get('/ping').expect(200);
  });
});
