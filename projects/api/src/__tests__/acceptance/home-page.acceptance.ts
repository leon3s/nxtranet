import {Client} from '@loopback/testlab';
import {NextranetApi} from '../..';
import {setupApplication} from './test-helper';

describe('HomePage', () => {
  let app: NextranetApi;
  let client: Client;

  before('setupApplication', async function () {
    this.timeout(50000);
    ({app, client} = await setupApplication());
  });

  after(async function () {
    this.timeout(50000);
    await app.stop();
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
      .expect('Content-Type', /text\/html/)
      .expect(/<title>LoopBack API Explorer/);
  });
});
