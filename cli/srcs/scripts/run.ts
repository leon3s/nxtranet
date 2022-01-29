import execa from 'execa';
import path from 'path';
import {
  findNxtDev,
  getServiceConfig
} from '../lib/nxtconfig';
import {
  ensureRoot, execaWsl
} from '../lib/system';

export const dev = async () => {
  ensureRoot();
  await execa('sudo', ['-u', 'nxtcore', 'node', path.join(__dirname, '../worker/service.js')], {
    stdio: ['ignore', process.stdout, process.stderr],
    env: {
      NODE_ENV: 'development',
    },
  });
}

export const winDev = () => {
  const {servicesDirectories, _path} = findNxtDev();
  for (const dir of servicesDirectories) {
    const services = getServiceConfig(path.join(_path, dir));
    for (const service of services) {
      execaWsl('npm', [
        'start'
      ], {
        windowTitle: service.pkg.name,
        username: service.user,
        cwd: service.path,
      });
    }
  }
}

export const prod = async () => {
  ensureRoot();
  const res = execa('sudo', ['-u', 'nxtcore', 'node', path.join(__dirname, '../worker/service.js')], {
    detached: true,
    stdio: 'ignore',
    env: {
      NODE_ENV: 'production',
    },
  });
  res.unref();
}
