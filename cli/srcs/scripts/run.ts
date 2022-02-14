import execa from 'execa';
import path from 'path';
import {
  runDir
} from '../lib/nxtconfig';
import {
  ensureRoot, ensureRunDir
} from '../lib/system';

export const dev = async () => {
  ensureRoot();
  ensureRunDir(runDir);
  await execa('sudo', [
    'NODE_ENV=development',
    '-u',
    'nxtcore',
    'node',
    path.join(__dirname, '../deamon/index.js')], {
    stdio: ['ignore', process.stdout, process.stderr],
  });
}

export const prod = async () => {
  ensureRoot();
  ensureRunDir(runDir);
  const res = execa('sudo', [
    'NODE_ENV=production',
    '-u',
    'nxtcore',
    'node',
    path.join(__dirname, '../deamon/index.js')], {
    detached: true,
    stdio: 'ignore',
  });
  res.unref();
}
