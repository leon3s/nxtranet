import type {ModelCluster, ModelContainer} from '@nxtranet/headers';
import axios from 'axios';
import {client, service} from '../srcs';
import clusterPayload from './cluster.payload';

let container: Partial<ModelContainer>;

jest.setTimeout(100000);

async function isContainerAlive() {
  await new Promise<void>((resolve, reject) => {
    const interv = setInterval(async () => {
      try {
        await axios.get(`http://127.0.0.1:${container.appPort}`);
        clearInterval(interv);
        clearTimeout(timeout);
        resolve();
      } catch (e) {
      }
    }, 2000);
    const timeout = setTimeout(() => {
      clearInterval(interv);
      reject(new Error('Timeout unable to get project responding'));
    }, 50000);
  });
}

describe('Test service docker', () => {
  beforeAll(async () => {
    await service.prepare();
    client.connect();
  });

  it('It Should get containers info', async () => {
    await client.containersInfo();
  });

  it('It Should deploy a container with a project inside', async function () {
    const cluster: ModelCluster = clusterPayload as any;
    if (!cluster.project.github_password) {
      console.warn('env variable GITHUB_PASSWORD is empty deploy may fail.');
    }
    container = await client.clustersDeploy({
      cluster,
      branch: 'development',
      commitSHA: 'test-commit',
    });
    console.log(container);
    await isContainerAlive();
  });

  it('It should stop container', async function () {
    await client.containersStop(container as ModelContainer);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  });

  it('It should start container', async function () {
    await client.containersStart(container as ModelContainer);
    await isContainerAlive();
  });

  it('It should attach to container', async function () {
    await client.containersAttach(container as ModelContainer);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  });

  it('It should get stats of the container', async function() {
    const stats = await client.containersStats({
      Id: container.dockerID,
    });
    console.log(stats);
  });

  it('It Should Remove container', async function () {
    await client.containersRemove({
      Id: container.dockerID,
    });
  });

  it('It should create a container with normal api', async function() {
    const container = await client.containersCreate({
      name: 'Test-name',
      Image: 'nginx',
    });
    await client.containersRemove({
      Id: container.Id,
    });
  });

  afterAll(async () => {
    client.disconnect();
    service.close();
  });
});
