import {Client, expect} from '@loopback/testlab';
import {NextranetApi} from '../..';
import {setupApplication} from './test-helper';

describe('PingController', () => {
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

  it('invokes GET /ping', async function () {
    this.timeout(50000);
    const res = await client.get('/ping?msg=world').expect(200);
    expect(res.body).to.containEql({greeting: 'Hello from LoopBack'});
  });
});
