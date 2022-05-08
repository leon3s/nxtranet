import {
  Client,
  givenHttpServerConfig,
  supertest
} from '@loopback/testlab';
import {NextranetApi, ServerApi} from '../..';
import {service as dockerService} from '../../../../../internal/docker';
import {service as nginxService} from '../../../../../internal/nginx';
import {service as dnsmasqService} from '../../../../../internal/dnsmasq';
import {service as systemService} from '../../../../../internal/system';

export async function setupServices() {
  await dockerService.prepare();
  await nginxService.prepare();
  await dnsmasqService.prepare();
  await systemService.prepare();
}

export async function stopServices() {
  await dockerService.close();
  await nginxService.close();
  await dnsmasqService.close();
  await systemService.close();
}

export async function setupApplication(): Promise<AppWithClient> {
  const server = new ServerApi({rest: givenHttpServerConfig()});
  await server.boot();
  await server.start();
  const app = server.lbApp;
  const client = supertest(server.app);
  return {server, client, app};
}

export interface AppWithClient {
  server: ServerApi;
  client: Client;
  app: NextranetApi;
}
