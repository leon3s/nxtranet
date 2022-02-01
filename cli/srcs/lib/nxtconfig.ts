import fs from 'fs';
import path from 'path';
import type {
  NxtConfig, NxtGlobalConfig, PackageDef, Pkgjson, ServiceDef
} from '../headers/nxtranetdev.h';

export const installDir = path.resolve(path.join(__dirname, '../../..'));

export const logsDir = path.join(installDir, 'logs');

export const nextranetNginx = path.resolve(path.join(__dirname, '../../../config/nginx/nextra.net'));
export const nginxDefault = path.resolve(path.join(__dirname, '../../../config/nginx/nginx.template.conf'));

/** Get .nxt from project to know settings */
export function findNxtConf(inpath = path.join(installDir, '.nxt')): NxtConfig {
  if (inpath === '/') {
    throw new Error('Error .nxt not found.');
  }
  const nxtConfigPath = path.join(inpath, '.nxt');
  try {
    const data = JSON.parse(fs.readFileSync(nxtConfigPath).toString());
    data.path = inpath;
    return data;
  } catch (e) {
    return findNxtConf(path.resolve(path.join(inpath, '..')));
  }
}

/** Read services directory to get user path and name of the service */
export async function getServiceDef(dir: string): Promise<ServiceDef[]> {
  const dirnames = fs.readdirSync(dir);
  return Promise.all((dirnames.map(async (dirname) => {
    const spath = path.join(dir, dirname);
    const nxthatdev_pjContent = fs.readFileSync(path.join(spath, '.nxtsrv')).toString();
    const pkg: Pkgjson = JSON.parse(fs.readFileSync(path.join(spath, 'package.json')).toString());
    return {
      ...JSON.parse(nxthatdev_pjContent),
      pkg: (pkg),
      path: spath,
      name: pkg.name.split('/').pop(),
    };
  })));
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
      name: pkg.name,
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
export async function getConfig(): Promise<NxtGlobalConfig> {
  const nxtConfig = findNxtConf();
  const services = await getServicesDefs(nxtConfig);
  const packages = await getPackagesDefs(nxtConfig);
  return {
    ...nxtConfig,
    services,
    packages,
  };
}
