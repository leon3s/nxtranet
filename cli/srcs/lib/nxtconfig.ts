import fs from 'fs';
import path from 'path';
import type {NxtdevConfig, ServiceConfig} from '../headers/nxtranetdev.h';

export function findNxtDev(inpath = process.cwd()): NxtdevConfig {
  if (inpath === '/') {
    throw new Error('Error .nxtdev not found.');
  }
  const nxtdevPath = path.join(inpath, '.nxt');
  try {
    const data = JSON.parse(fs.readFileSync(nxtdevPath).toString());
    data._path = inpath;
    return data;
  } catch (e) {
    return findNxtDev(path.resolve(path.join(inpath, '..')));
  }
}

/** Read services directory to user path and name of the service */
export function getServiceConfig(dir: string): ServiceConfig[] {
  const services: ServiceConfig[] = [];
  const dirNames = fs.readdirSync(dir);
  for (const dirName of dirNames) {
    try {
      const service = {
        path: path.join(dir, dirName),
      };
      const nxthatdev_pjContent = fs.readFileSync(path.join(service.path, '.nxtsrv')).toString();
      const pkg = fs.readFileSync(path.join(service.path, 'package.json')).toString();
      services.push({
        ...service,
        ...JSON.parse(nxthatdev_pjContent),
        pkg: JSON.parse(pkg),
      });
    } catch (e) {
      // just skip is .nxthatdev_pj file not exist.
    }
  }
  return services;
}
