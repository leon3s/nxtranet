import execa from 'execa';
import fs from 'fs';
import mustache from 'mustache';
import path from 'path';
import type {
  NxtGlobalConfig,
  NxtUserConfig,
  PackageDef,
  ServiceDef
} from '../headers/nxtranetdev.h';
import {
  coreUser, dnsmasqDefault,
  getBuildConfig,
  installDir,
  logsDir,
  nginxDefault,
  nxtranetNginx,
  nxtranetUserconf,
  nxtranetUserConfDefault,
  nxtranetUserconfDir,
  runDir, sysGroup
} from '../lib/nxtconfig';
import getUserConfig from '../lib/nxtUserconfig';
import {chownForCoreUser} from '../lib/system';

function generateNginxNxtranet(nxtUserconf: NxtUserConfig) {
  const template = fs.readFileSync(nxtranetNginx, 'utf-8');
  const render = mustache.render(template, nxtUserconf);
  fs.writeFileSync('/etc/nginx/sites-available/nxtranet', render);
}

function generateDnsmasqConf(nxtUserconf: NxtUserConfig) {
  const template = fs.readFileSync(dnsmasqDefault, 'utf-8');
  const render = mustache.render(template, nxtUserconf);
  fs.writeFileSync('/etc/dnsmasq.conf', render);
}

async function configureDnsmasq(nxtUserconf: NxtUserConfig) {
  generateDnsmasqConf(nxtUserconf);
}

async function configureNginx(nxtUserconf: NxtUserConfig) {
  await execa('cp', [nginxDefault, '/etc/nginx/nginx.conf']);
  generateNginxNxtranet(nxtUserconf);
  if (!fs.existsSync(path.join('/etc/nginx/sites-enabled', 'nxtranet'))) {
    await execa('ln', ['-s', '/etc/nginx/sites-available/nxtranet', '/etc/nginx/sites-enabled']);
  }
}

function setServiceFilePerms(service: ServiceDef) {
  return Promise.all((service?.filePermissions || []).map((filePath) =>
    execa('sudo', [
      'chown',
      '-R',
      `${service.user}`,
      filePath,
    ])
  ));
}

function setServicesFilePerms(services: ServiceDef[]) {
  return Promise.all(services.map(setServiceFilePerms));
}

async function createSysGroupIfNotExist() {
  try {
    await execa('getent', ['group', sysGroup]);
  } catch ({ }) {
    await execa('groupadd', [sysGroup])
  }
}

async function createUser(userName: string, homedir: string) {
  await execa('sudo', [
    'useradd',
    '-m',
    '-d',
    homedir,
    userName,
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

async function createUserIfnotExist(username: string, homedir: string) {
  const isUserExist = await userExist(username);
  if (!isUserExist) {
    await createUser(username, homedir);
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

async function initLogsDir() {
  await execa('sudo', [
    'mkdir',
    '-p',
    logsDir,
  ]);
  await chownForCoreUser(logsDir);
  await execa('sudo', [
    'chmod',
    '770',
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
  await createUserIfnotExist(service.user, service.path);
  await addUserToSysGroup(service.user);
  await chownService(service);
  try {
    await installNodeDeps(service);
  } catch (err: any) {
    console.error('Error while installing dependencies for ', service.path, err.stderr);
  }
}

async function installServices(services: ServiceDef[]) {
  for (const s of services) {
    console.log('Installing service : ', s.name);
    await installService(s);
  }
}

async function chownPackagesDirectories(nxtconfig: NxtGlobalConfig) {
  return Promise.all(nxtconfig.packagesDirectories.map((packageDirectory) => {
    const ppath = path.join(nxtconfig.path, packageDirectory);
    return chownForGroup(ppath);
  }));
}

async function initNxtranetRunDir() {
  if (!fs.existsSync(runDir)) {
    fs.mkdirSync(runDir);
  }
  await chownForCoreUser(runDir);
}

async function initNxtranetUserconfig() {
  if (!fs.existsSync(nxtranetUserconfDir)) {
    fs.mkdirSync(nxtranetUserconfDir);
  }
  if (!fs.existsSync(nxtranetUserconf)) {
    await execa('sudo', [
      'cp',
      nxtranetUserConfDefault,
      nxtranetUserconf,
    ]);
    await chownForCoreUser(nxtranetUserconfDir);
  }
}

async function initCoreUserAndGroup() {
  await createSysGroupIfNotExist();
  await createUserIfnotExist(coreUser, installDir);
  await addUserToSysGroup(coreUser);
}

async function configureSystem() {
  await initCoreUserAndGroup();
  await initNxtranetUserconfig();
  await initNxtranetRunDir();
  await initLogsDir();
}

async function configureNxtServices() {
  const nxtconfig = await getBuildConfig();
  await chownPackagesDirectories(nxtconfig);
  await installPackages(nxtconfig.packages);
  await installServices(nxtconfig.services);
  await setServicesFilePerms(nxtconfig.services);
}

async function generateConfigFiles() {
  const nxtUserconf = getUserConfig();
  await configureNginx(nxtUserconf);
  await configureDnsmasq(nxtUserconf);
}

export default async function install() {
  if (process.getuid() !== 0) {
    process.stdout.write("Install commande have to be run as root.\n");
    process.exit(0);
  }
  await configureSystem();
  await configureNxtServices();
  await generateConfigFiles();
}
