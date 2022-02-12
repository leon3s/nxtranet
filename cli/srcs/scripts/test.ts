import execa from 'execa';
import type {ServiceDef} from '../headers/nxtranetdev.h';
import {getBuildConfig} from '../lib/nxtconfig';
import getUserConfig, {userConfigToEnv} from '../lib/nxtUserconfig';
import {ensureRoot} from '../lib/system';

export async function testService(service: ServiceDef, envs: string[]) {
  await execa('sudo', [
    '-u',
    service.user,
    ...envs,
    'npm',
    'run',
    'test',
  ], {
    cwd: service.path,
    stdio: ['ignore', process.stdout, process.stderr],
  });
}

export async function test(projectName?: string) {
  ensureRoot();
  const nxtconfig = await getBuildConfig();
  const nxtUserconfig = await getUserConfig();
  const envs = userConfigToEnv(nxtUserconfig);
  let services = nxtconfig.services;
  if (projectName) {
    services = services.filter(({name}) => name === projectName);
  }
  for (const service of services) {
    await testService(service, envs);
  }
}
