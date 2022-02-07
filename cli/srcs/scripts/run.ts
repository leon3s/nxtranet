import execa from 'execa';
import path from 'path';
import {
  getBuildConfig,
  runDir
} from '../lib/nxtconfig';
import {
  ensureRoot, ensureRunDir, execaWsl
} from '../lib/system';

export const dev = async () => {
  ensureRoot();
  ensureRunDir(runDir);
  await execa('sudo', [
    'NODE_ENV=development',
    '-u',
    'nxtcore',
    'node',
    path.join(__dirname, '../worker/main.js')], {
    stdio: ['ignore', process.stdout, process.stderr],
  });
}

/** This aim to fix hot reload when dashboard is started inside wsl */
export async function winDev() {
  const nxtConf = await getBuildConfig();
  await Promise.all(nxtConf.services.map((service) =>
    execaWsl('npm', [
      'start'
    ], {
      windowTitle: service.pkg.name,
      username: service.user,
      cwd: service.path,
    })
  ));
}

export const prod = async () => {
  ensureRoot();
  ensureRunDir(runDir);
  const res = execa('sudo', [
    'NODE_ENV=production',
    '-u',
    'nxtcore',
    'node',
    path.join(__dirname, '../worker/main.js')], {
    detached: true,
    stdio: 'ignore',
  });
  res.unref();
}
