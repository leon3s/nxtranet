import execa from 'execa';
import path from 'path';
import {
  ensureRoot
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
