/**
 * Script to install and build packages and services
 */
import execa from 'execa';
import fs from 'fs';
import path from 'path';
import type {
  NxtGlobalConfig,
  PackageDef,
  ServiceDef
} from '../headers/nxtranetdev.h';
import {generateConfigFiles} from '../lib/config';
import {
  coreUser,
  getBuildConfig,
  installDir,
  logsDir,
  nxtranetUserconf,
  nxtranetUserConfDefault,
  nxtranetUserconfDir,
  runDir,
  sysGroup
} from '../lib/nxtconfig';
import {
  chownForCoreUser,
  ensureRoot
} from '../lib/system';

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
  for (const pkg of packages) {
    process.stdout.write(`Installing package : ${pkg.name}\n`);
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

  }
}

async function chmodForGroup(filepath: string) {
  await execa('sudo', [
    'chmod',
    '770',
    '-R',
    filepath,
  ]);
}

async function initLogsDir() {
  await execa('sudo', [
    'mkdir',
    '-p',
    logsDir,
  ]);
  await chownForCoreUser(logsDir);
  await chmodForGroup(logsDir);
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
  await chmodForGroup(service.path);
  try {
    await installNodeDeps(service);
  } catch (err: any) {
    console.error('Error while installing dependencies for ', service.path, err.stderr);
  }
}

async function installServices(services: ServiceDef[]) {
  for (const s of services) {
    process.stdout.write(`installing service : ${s.name}\n`);
    await installService(s);
  }
}

async function chownPackagesDirectories(nxtconfig: NxtGlobalConfig) {
  return Promise.all(nxtconfig.packagesDirectories.map(async (packageDirectory) => {
    const ppath = path.join(nxtconfig.path, packageDirectory);
    await chmodForGroup(ppath);
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
  await chownForGroup(installDir);
  await chmodForGroup(installDir);
}

async function configureSystem() {
  process.stdout.write('Configuring system');
  await initCoreUserAndGroup();
  process.stdout.write('.')
  await initNxtranetUserconfig();
  process.stdout.write('.')
  await initNxtranetRunDir();
  process.stdout.write('.')
  await initLogsDir();
  process.stdout.write('.\n');
}

async function installNxtranet() {
  process.stdout.write('Installing nxtranet\n');
  const nxtconfig = await getBuildConfig();
  await chownPackagesDirectories(nxtconfig);
  await installPackages(nxtconfig.packages);
  await installServices(nxtconfig.services);
  await setServicesFilePerms(nxtconfig.services);
}

async function install() {
  ensureRoot();
  await configureSystem();
  await installNxtranet();
  process.stdout.write('Generating configuration files.\n');
  await generateConfigFiles();
  process.stdout.write('Installation done.\n');
}

async function main() {
  await install();
}

main().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error(err.message);
  process.exit(1);
});
