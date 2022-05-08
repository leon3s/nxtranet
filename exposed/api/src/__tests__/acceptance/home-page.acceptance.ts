import {Client} from '@loopback/testlab';
import {setupApplication, setupServices, stopServices} from './test-helper';

import type {ServerApi} from '../..';

describe('HomePage', () => {
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

  it('exposes a default home page', async function () {
    this.timeout(50000);
    await client
      .get('/')
      .expect(200)
      .expect('Content-Type', /text\/html/);
  });

  it('exposes self-hosted explorer', async function () {
    this.timeout(50000);
    await client
      .get('/explorer/')
      .expect(200)
      .expect('Content-Type', /text\/html/);
  });
});
