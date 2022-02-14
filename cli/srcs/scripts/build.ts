import {getBuildConfig} from '../lib/nxtconfig';
import getUserConfig, {userConfigToEnv} from '../lib/nxtUserconfig';
import * as packageHelper from '../lib/package';
import * as serviceHelper from '../lib/service';
import {ensureRoot} from '../lib/system';

export async function buildService(projectName?: string) {
  ensureRoot();
  const nxtconfig = await getBuildConfig();
  const nxtUserconfig = await getUserConfig();
  const envs = userConfigToEnv(nxtUserconfig);
  let services = nxtconfig.services;
  if (projectName) {
    services = services.filter(({name}) => name === projectName);
  }
  for (const service of services) {
    if (process.env.NODE_ENV === 'production' || !service.skipDevBuild) {
      await serviceHelper.build(service, envs);
    }
  }
}

export async function buildPackage(packageName?: string) {
  ensureRoot();
  const nxtconfig = await getBuildConfig();
  const nxtUserconfig = await getUserConfig();
  const envs = userConfigToEnv(nxtUserconfig);
  let packages = nxtconfig.packages;
  if (packageName) {
    packages = packages.filter(({name}) => name === packageName);
  }
  for (const pkg of packages) {
    await packageHelper.build(pkg, envs);
  }
}
