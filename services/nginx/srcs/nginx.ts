import type {NginxSiteAvaible} from '@nxtranet/headers';
import execa from 'execa';
import fs from 'fs';
import path from 'path';

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
  return execa('sudo', ['service', 'nginx', 'start'], {
    cwd: __dirname,
  });
}

export const restartService = () => {
  return execa('sudo', ['service', 'nginx', 'restart'], {
    cwd: __dirname,
  });
}

export const reloadService = async () => {
  // await execa('sudo', ['nginx', '-s', 'reopen'], {
  //   cwd: __dirname,
  // });
  return execa('sudo', ['service', 'nginx', 'reload'], {
    cwd: __dirname,
  });
}

export const testConfig = () => {
  return execa('sudo', ['nginx', '-T'], {
    cwd: __dirname,
  });
}

export const deployConfig = (filename: string) => {
  const siteEnabled = path.join(siteEnabledPath, filename);
  if (fs.existsSync(siteEnabled)) return;
  return execa('ln', ['-s', path.join(siteAvaiblePath, filename), siteEnabled], {
    cwd: __dirname,
  });
}

export const readStreamErrorLog = () => {
  return fs.createReadStream(errorLogPath);
}

export const readStreamAccessLog = () => {
  return fs.createReadStream(accessLogPath);
}
