import execa from 'execa';
import fs from 'fs';
import path from 'path';
import type {NxtdevConfig, ServiceConfig} from '../headers/nxtranetdev.h';
import {findNxtDev, getServiceConfig} from '../lib/nxtconfig';

const mainUser = 'nxtcore';
const sysGroup = 'gp_nxtranet';

const nextranetNginx = path.resolve(path.join(__dirname, '../../../config/nginx/nextra.net'));

const defaultSystemPkg = ['nginx', 'dnsmasq', 'mongodb'];

const installSystemPkg = async (name: string) => {
  await execa('sudo', [
    'apt-get',
    'install',
    '-y',
    name,
  ]);
}

const configureNginx = async () => {
  await execa('cp', [nextranetNginx, '/etc/nginx/sites-available']);
  if (!fs.existsSync(path.join('/etc/nginx/sites-enabled', 'nextra.net'))) {
    await execa('ln', ['-s', '/etc/nginx/sites-available/nextra.net', '/etc/nginx/sites-enabled']);
  }
  // await execa('chown', ['-R', 'nxtsrv-nginx', '/etc/nginx/sites-available']);
  // await execa('chown', ['-R', 'nxtsrv-nginx', '/etc/nginx/sites-enabled']);
}

async function createGroupIfNotExist() {
  try {
    await execa('getent', ['group', sysGroup]);
  } catch ({ }) {
    await execa('groupadd', [sysGroup])
  }
}

/** Create user to run services if not exist */
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

const chownService = (service: ServiceConfig) => {
  return execa('chown', ['-R', service.user, service.path]);
}

const installNodeDeps = (service: ServiceConfig) => {
  const child = execa('sudo', ['-u', service.user, 'npm', 'install'], {
    cwd: service.path,
    stdio: 'pipe',
  });
  return child;
}

const installPackages = async () => {
  const packagesDir = '/etc/nxtranet/packages';
  const packages = fs.readdirSync(packagesDir);
  for (const pkg of packages) {
    const pkgDir = path.join(packagesDir, pkg);
    await execa('sudo', [
      '-u',
      mainUser,
      'npm',
      'install',
    ], {
      cwd: pkgDir,
    });
    await execa('sudo', [
      '-u',
      mainUser,
      'npm',
      'run',
      'build'
    ], {
      cwd: pkgDir,
    });
  }
}

const chownForCoreUser = async (pth: string) => {
  await execa('sudo', [
    'chown',
    '-R',
    `nxtcore:${sysGroup}`,
    pth,
  ]);
}

const createLogsDir = async () => {
  await execa('sudo', [
    'mkdir',
    '-p',
    '/etc/nxtranet/logs',
  ]);
  await execa('sudo', [
    'chmod',
    '777',
    '/etc/nxtranet/logs'
  ]);
}

const chownForGroup = async (pth: string) => {
  await execa('sudo', [
    'chown',
    '-R',
    `:${sysGroup}`,
    pth,
  ]);
}

const installService = async (service: ServiceConfig) => {
  console.log('Configuring service : ', service.pkg.name);
  await createUserIfnotExist(service.user);
  await addUserToSysGroup(service.user);
  console.log(`${service.user} user created`);
  await chownService(service);
  console.log(`${service.path} chown for user ${service.user}`);
  try {
    await installNodeDeps(service);
    console.log('Node dependencies installed.');
  } catch (err: any) {
    console.error('Error while installing dependencies for ', service.path, err.stderr);
  }
}

const installServices = async (nxtDev: NxtdevConfig) => {
  await Promise.all(nxtDev.servicesDirectories.map(async (dir) => {
    const services = getServiceConfig(path.join(nxtDev._path, dir));
    await Promise.all(services.map(installService));
  }));
}

const installSystemPkgs = async () => {
  await Promise.all(defaultSystemPkg.map(async (pkg) => {
    await installSystemPkg(pkg);
  }));
}

const install = async () => {
  if (process.getuid() !== 0) {
    console.log("Install commande have to be run as root.");
    process.exit(0);
  }
  const nxtDev = findNxtDev();
  await createGroupIfNotExist();
  await createUserIfnotExist(mainUser);
  await addUserToSysGroup(mainUser);
  await chownForCoreUser('/etc/nxtranet');
  await installPackages();
  await chownForGroup('/etc/nxtranet/packages');
  await createLogsDir();
  await chownForCoreUser('/etc/nxtranet/logs');
  await installServices(nxtDev);
  await configureNginx();
}

export default install;
