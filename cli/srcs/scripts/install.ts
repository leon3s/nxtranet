import execa from 'execa';
import fs from 'fs';
import path from 'path';
import type {NxtGlobalConfig, PackageDef, ServiceDef} from '../headers/nxtranetdev.h';
import {getConfig} from '../lib/nxtconfig';

const coreUser = 'nxtcore';
const sysGroup = 'gp_nxtranet';

const installDir = path.resolve(path.join(__dirname, '../../..'));
const logsDir = path.join(installDir, 'logs');
const nextranetNginx = path.resolve(path.join(__dirname, '../../../config/nginx/nextra.net'));

const defaultSystemPkg = ['nginx', 'dnsmasq', 'mongodb'];

async function installSystemPkg(name: string) {
  await execa('sudo', [
    'apt-get',
    'install',
    '-y',
    name,
  ]);
}

async function configureNginx() {
  await execa('cp', [nextranetNginx, '/etc/nginx/sites-available']);
  if (!fs.existsSync(path.join('/etc/nginx/sites-enabled', 'nextra.net'))) {
    await execa('ln', ['-s', '/etc/nginx/sites-available/nextra.net', '/etc/nginx/sites-enabled']);
  }
  await execa('chown', ['-R', 'nxtsrv-nginx', '/etc/nginx/sites-available']);
  await execa('chown', ['-R', 'nxtsrv-nginx', '/etc/nginx/sites-enabled']);
}

async function createGroupIfNotExist() {
  try {
    await execa('getent', ['group', sysGroup]);
  } catch ({ }) {
    await execa('groupadd', [sysGroup])
  }
}

async function createUser(userName: string) {
  await execa('sudo', [
    'useradd',
    '-m',
    userName
  ]);
}

async function userExist(userName: string) {
  try {
    await execa('sudo', [
      'getent',
      'passwd',
      userName,
    ]);
    return true;
  } catch ({ }) {
    return false;
  }
}

async function createUserIfnotExist(username: string) {
  const isUserExist = await userExist(username);
  if (!isUserExist) {
    await createUser(username);
  }
}

async function addUserToSysGroup(username: string) {
  const res = await execa('sudo', ['groups', username]);
  const isIngroup = res.stdout.includes("gp_nxtranet");
  if (!isIngroup) {
    await execa('sudo', [
      'usermod',
      '-a',
      '-G',
      sysGroup,
      username,
    ]);
  }
}

async function chownService(service: ServiceDef) {
  return execa('chown', ['-R', service.user, service.path]);
}

async function installNodeDeps(service: ServiceDef) {
  const child = execa('sudo', ['-u', service.user, 'npm', 'install'], {
    cwd: service.path,
    stdio: 'pipe',
  });
  return child;
}

async function installPackages(packages: PackageDef[]) {
  return Promise.all(packages.map(async (pkg) => {
    await execa('sudo', [
      '-u',
      coreUser,
      'npm',
      'install',
    ], {
      cwd: pkg.path,
    });
    await execa('sudo', [
      '-u',
      coreUser,
      'npm',
      'run',
      'build'
    ], {
      cwd: pkg.path,
    });
  }))
}

async function chownForCoreUser(pth: string) {
  await execa('sudo', [
    'chown',
    '-R',
    `nxtcore:${sysGroup}`,
    pth,
  ]);
}

async function createLogsDir(logsDir: string) {
  await execa('sudo', [
    'mkdir',
    '-p',
    logsDir,
  ]);
  await execa('sudo', [
    'chmod',
    '777',
    logsDir
  ]);
}

async function chownForGroup(pth: string) {
  await execa('sudo', [
    'chown',
    '-R',
    `:${sysGroup}`,
    pth,
  ]);
}

async function installService(service: ServiceDef) {
  await createUserIfnotExist(service.user);
  await addUserToSysGroup(service.user);
  await chownService(service);
  try {
    await installNodeDeps(service);
  } catch (err: any) {
    console.error('Error while installing dependencies for ', service.path, err.stderr);
  }
}

async function installServices(services: ServiceDef[]) {
  return Promise.all(services.map(installService));
}

async function installSystemPkgs() {
  for (const pkg of defaultSystemPkg) {
    await installSystemPkg(pkg);
  }
}

async function chownPackagesDirectories(nxtconfig: NxtGlobalConfig) {
  return Promise.all(nxtconfig.packagesDirectories.map((packageDirectory) => {
    const ppath = path.join(nxtconfig.path, packageDirectory);
    return chownForGroup(ppath);
  }));
}

async function configureSystem() {
  await installSystemPkgs();
  await createGroupIfNotExist();
  await createUserIfnotExist(coreUser);
  await addUserToSysGroup(coreUser);
  await chownForCoreUser(installDir);
  await createLogsDir(logsDir);
  await chownForCoreUser(logsDir);
}

async function installNxtranet() {
  const nxtconfig = await getConfig();
  await installPackages(nxtconfig.packages);
  await chownPackagesDirectories(nxtconfig);
  await installServices(nxtconfig.services);
}

export default async function install() {
  if (process.getuid() !== 0) {
    process.stdout.write("Install commande have to be run as root.\n");
    process.exit(0);
  }
  await configureSystem();
  await installNxtranet();
  await configureNginx();
}
