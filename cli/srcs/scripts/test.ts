import {getBuildConfig} from '../lib/nxtconfig';
import getUserConfig, {userConfigToEnv} from '../lib/nxtUserconfig';
import {ensureRoot} from '../lib/system';
import * as serviceHelper from '../lib/service';

export async function testService(projectName?: string) {
  ensureRoot();
  const nxtconfig = await getBuildConfig();
  const nxtUserconfig = getUserConfig();
  const envs = userConfigToEnv(nxtUserconfig);
  let services = nxtconfig.services;
  if (projectName) {
    services = services.filter(({name}) => name === projectName);
  }
  for (const service of services) {
    await serviceHelper.test(service, envs);
  }
}
