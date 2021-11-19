import {
  Client,
  createRestAppClient,
  givenHttpServerConfig
} from '@loopback/testlab';
import {NextranetApi} from '../..';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.

    // host: process.env.HOST,
    // port: 1444,
  });

  const app = new NextranetApi({
    rest: restConfig,
  });

  await app.boot();
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: NextranetApi;
  client: Client;
}
