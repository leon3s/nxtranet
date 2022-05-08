import {Client, expect} from '@loopback/testlab';
import {setupApplication, setupServices, stopServices} from './test-helper';
import type {ServerApi} from '../..';
import type {Project} from '../../models'

describe('PingController', () => {
  let server: ServerApi;
  let client: Client;
  let project: Project;

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

  it('invokes POST /projects', async function () {
    this.timeout(50000);
    const newProject: Partial<Project> = {
      name: 'express-test-deploy-test-2',
      github_username: 'leon3s',
      github_project: 'express-test-deploy',
    }
    const res = await client.post('/projects')
      .send(newProject)
      .expect(200);
    project = res.body;
    expect(res.body).to.containDeep(newProject);
  });

  it('invokes DELETE /projects/{name}', async function () {
    this.timeout(50000);
    const res = await client.delete(`/projects/${project.name}`)
      .expect(200);
  });
});
