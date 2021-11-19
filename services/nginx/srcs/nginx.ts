import fs from 'fs';
import path from 'path';
import execa from 'execa';

import type {NginxSiteAvaible} from '@nxtranet/headers';

const errorLogPath = '/var/log/nginx/error.log';
const accessLogPath = '/var/log/nginx/access.log';
const siteEnabledPath = '/etc/nginx/sites-enabled';
const siteAvaiblePath = '/etc/nginx/sites-available';

export const getSitesAvaible = (): NginxSiteAvaible[] => {
  const siteAvaibles: NginxSiteAvaible[] = [];
  const files = fs.readdirSync(siteAvaiblePath);
  for (const file of files) {
    const content = fs.readFileSync(path.join(siteAvaiblePath, file)).toString();
    siteAvaibles.push({
      name: file,
      content,
    });
  }
  return siteAvaibles;
}

export const writeSiteAvaible = (filename: string, content: string) => {
  fs.writeFileSync(path.join(siteAvaiblePath, filename), content);
}

export const startService = () => {
  return execa('service', ['nginx', 'start'], {
    cwd: __dirname,
  });
}

export const restartService = () => {
  console.log('restart function !');
  return execa('service', ['nginx', 'restart'], {
    cwd: __dirname,
  });
}

export const testConfig = () => {
  return execa('nginx', ['-t'], {
    cwd: __dirname,
  });
}

export const deployConfig = async (filename: string) => {
  await execa('ln', [path.join(siteAvaiblePath, filename), path.join(siteEnabledPath, filename)], {
    cwd: __dirname,
  });
  return restartService();
}

export const readStreamErrorLog = () => {
  return fs.createReadStream(errorLogPath);
}

export const readStreamAccessLog = () => {
  return fs.createReadStream(accessLogPath);
}
