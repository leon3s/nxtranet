import {getBuildConfig} from '../lib/nxtconfig';
import getUserConfig, {userConfigToEnv} from '../lib/nxtUserconfig';
import * as packageHelper from '../lib/package';
import * as serviceHelper from '../lib/service';
import {ensureRoot} from '../lib/system';

type buildFunction = (name: string) => Promise<void>;

enum BuildTypes {
  SERVICE = 'service',
  PACKAGE = 'package',
}

async function buildService(projectName?: string) {
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

async function buildPackage(packageName?: string) {
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

const types: Record<string, buildFunction> = {
  service: buildService,
  package: buildPackage,
}

async function main() {
  const [{ }, { }, type, name] = process.argv;
  const fn = types[type];
  if (!fn) {
    console.error(`build script argument ${type} invalid.`);
    console.error(`try \`nxtranet build service\` or \`nxtranet build package\``);
    process.exit(1);
  }
  await fn(name);
}

main().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error(err.message);
  process.exit(1);
});
