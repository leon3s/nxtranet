import execa from 'execa';
import fs from 'fs';
import path from 'path';
import type {NxtGlobalConfig, ServiceDef} from '../headers/nxtranetdev.h';
import {
  coreUser, sysGroup
} from './nxtconfig';

/** Verify if the script is run as root */
export async function ensureRoot() {
  if (process.getuid() !== 0) {
    process.stdout.write('must be run as root.\n');
    process.exit(0);
  }
}

/** UNIX only */
export async function getUserInfo(username: string): Promise<{uid: number, gid: number}> {
  const {stdout} = await execa('id', [username]);
  const uid = +(stdout.replace(/(uid=)([0-9]{4})(.*)/g, '$2'));
  const gid = +(stdout.replace(/(.*gid=)([0-9]{4})(.*)/g, '$2'));
  return {
    uid,
    gid,
  };
}

/** Unix only */
export async function ensureUser(user: string): Promise<void> {
  const res = await execa('whoami', []);
  if (res.stdout !== user) {
    throw new Error('User not matching.');
  }
}

export async function chownForCoreUser(pth: string) {
  await execa('sudo', [
    'chown',
    '-R',
    `${coreUser}:${sysGroup}`,
    pth,
  ]);
}

export async function chownForGroup(pth: string) {
  await execa('sudo', [
    'chown',
    '-R',
    `:${sysGroup}`,
    pth,
  ]);
}

export async function chmodForGroup(filepath: string) {
  await execa('sudo', [
    'chmod',
    '770',
    '-R',
    filepath,
  ]);
}

export async function chownService(service: ServiceDef) {
  return execa('chown', ['-R', service.user, service.path]);
}

export async function chownPackagesDirectories(nxtconfig: NxtGlobalConfig) {
  return Promise.all(nxtconfig.packagesDirectories.map(async (packageDirectory) => {
    const ppath = path.join(nxtconfig.path, packageDirectory);
    await chmodForGroup(ppath);
    return chownForGroup(ppath);
  }));
}

export async function ensureRunDir(runDir: string) {
  fs.mkdirSync(runDir, {
    recursive: true,
  });
  await chownForCoreUser(runDir);
}
