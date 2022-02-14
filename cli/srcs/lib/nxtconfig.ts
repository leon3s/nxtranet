import fs from 'fs';
import path from 'path';
import type {
  NxtConfig,
  NxtGlobalConfig,
  PackageDef,
  Pkgjson,
  ServiceDef
} from '../headers/nxtranetdev.h';

export const coreUser = 'nxtcore';

export const sysGroup = 'gp_nxtranet';

export const installDir = path.resolve(path.join(__dirname, '../../..'));

export const logsDir = path.join('/var/log', 'nxtranet');

export const runDir = path.join('/var/run', 'nxtranet');

export const nxtranetUserconfDir = path.join('/etc', 'nxtranet');

export const nxtranetUserconf = path.join(nxtranetUserconfDir, 'nxtranet.conf');

export const nxtranetUserConfDefault = path.join(installDir, 'config/nxtranet/nxtranet.conf');

export const nxtranetNginx = path.join(installDir, 'config/nginx/nxtranet.template.conf');

export const nginxDefault = path.join(installDir, 'config/nginx/nginx.template.conf');

export const dnsmasqDefault = path.join(installDir, 'config/dnsmasq/dnsmasq.template.conf');

/** Get .nxt from project to know settings */
export function getNxtranetBuild(inpath = installDir): NxtConfig {
  if (inpath === '/') {
    throw new Error('Error .nxt not found.');
  }
  const nxtConfigPath = path.join(inpath, 'nxtranet.build');
  try {
    const data = JSON.parse(fs.readFileSync(nxtConfigPath, 'utf-8'));
    data.path = inpath;
    return data;
  } catch (e) {
    return getNxtranetBuild(path.resolve(path.join(inpath, '..')));
  }
}

/** Read services directory to get user path and name of the service */
export async function getServiceDef(dir: string): Promise<ServiceDef[]> {
  const dirnames = fs.readdirSync(dir);
  const res = await Promise.all((dirnames.map(async (dirname) => {
    const spath = path.join(dir, dirname);
    if (!fs.lstatSync(spath).isDirectory()) return null;
    const nxthatdev_pjContent = fs.readFileSync(path.join(spath, '.nxtsrv')).toString();
    const pkg: Pkgjson = JSON.parse(fs.readFileSync(path.join(spath, 'package.json')).toString());
    return {
      ...JSON.parse(nxthatdev_pjContent),
      pkg: (pkg),
      path: spath,
      name: pkg.name.split('/').pop(),
    };
  })));
  const ret = res.filter((d) => !!d);
  return ret;
}

/** Read Services for all servicesDirectories inside .nxt config file */
export async function getServicesDefs(nxtConfig: NxtConfig) {
  const services = await Promise.all(nxtConfig.servicesDirectories.map((serviceDirectory) => {
    const servicePath = path.join(nxtConfig.path, serviceDirectory);
    return getServiceDef(servicePath);
  }));
  return services.reduce((acc, item) => {
    return [...acc, ...item];
  }, []);
}

/** Read package directory to get path, name and package of the service */
export async function getPackageDef(dir: string): Promise<PackageDef[]> {
  const dirnames = fs.readdirSync(dir);
  return Promise.all(dirnames.map((dirname) => {
    const ppath = path.join(dir, dirname);
    const pkg: Pkgjson = JSON.parse(fs.readFileSync(path.join(ppath, 'package.json')).toString());
    return {
      name: pkg.name.split('/').pop() || '',
      path: ppath,
      pkg,
    }
  }));
}

/** Read Services for all packagesDirectories inside .nxt config file */
export async function getPackagesDefs(nxtConfig: NxtConfig) {
  const packages = await Promise.all(nxtConfig.packagesDirectories.map((packageDirectory) => {
    const packagePath = path.join(nxtConfig.path, packageDirectory);
    return getPackageDef(packagePath);
  }));
  return packages.reduce((acc, item) => {
    return [...acc, ...item];
  });
}

/** Get all config of the project including services and packages to builds */
export async function getBuildConfig(): Promise<NxtGlobalConfig> {
  const nxtConfig = getNxtranetBuild();
  const services = await getServicesDefs(nxtConfig);
  const packages = await getPackagesDefs(nxtConfig);
  return {
    ...nxtConfig,
    services,
    packages,
  };
}
