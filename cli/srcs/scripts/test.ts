import {getBuildConfig} from '../lib/nxtconfig';
import getUserConfig, {userConfigToEnv} from '../lib/nxtUserconfig';
import * as serviceHelper from '../lib/service';
import {ensureRoot} from '../lib/system';

async function testService(projectName?: string) {
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

async function main() {
  const [{ }, { }, projectName] = process.argv;
  await testService(projectName);
}

main().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error(err.message);
  process.exit(1);
});
