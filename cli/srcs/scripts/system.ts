import execa from 'execa';
import fs from 'fs';
import path from 'path';
import type {ServiceConfig} from '../headers/nxtranetdev.h';

const sysGroup = 'gp_nxtranet';

const nextranetNginx = path.resolve(path.join(__dirname, '../../../config/nginx/nextra.net'));

/** TODO detect system to change installation */
export async function detectSystem() { }

/** Read services directory to user path and name of the service */
function getServiceConfig(dir: string): ServiceConfig[] {
  const services: ServiceConfig[] = [];
  const dirNames = fs.readdirSync(dir);
  for (const dirName of dirNames) {
    try {
      const service = {
        path: path.join(dir, dirName),
      };
      const nxthatdev_pjContent = fs.readFileSync(path.join(service.path, '.nxthatdev_pj')).toString();
      const pkg = fs.readFileSync(path.join(service.path, 'package.json')).toString();
      services.push({
        ...service,
        ...JSON.parse(nxthatdev_pjContent),
        pkg: JSON.parse(pkg),
      });
    } catch (e) {
      // just skip is .nxthatdev_pj file not exist.
    }
  }
  return services;
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
  await execa('useradd', [userName]);
}

async function userExist(userName: string) {
  try {
    await execa('getent', ['passwd', userName]);
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
  const res = await execa('groups', [username]);
  const isIngroup = res.stdout.includes("gp_nxtranet");
  if (!isIngroup) {
    await execa('usermod', ['-a', '-G', sysGroup, username]);
  }
}

function findNxtDev(inpath = process.cwd()): Record<string, any> {
  if (inpath === '/') {
    throw new Error('Error .nxtdev not found.');
  }
  const nxtdevPath = path.join(inpath, '.nxtdev');
  try {
    const data = JSON.parse(fs.readFileSync(nxtdevPath).toString());
    data._path = inpath;
    return data;
  } catch (e) {
    return findNxtDev(path.resolve(path.join(inpath, '..')));
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

export const installPackagesDeps = async () => {
  const packagesDir = '/etc/nxtranet/packages';
  const packages = fs.readdirSync(packagesDir);
  for (const pkg of packages) {
    const pkgDir = path.join(packagesDir, pkg);
    await execa('sudo', [
      '-u',
      'nxtcore',
      'npm',
      'install',
    ], {
      cwd: pkgDir,
    });
  }
}

export const chownForGroup = async (pth: string) => {
  await execa('sudo', [
    'chown',
    '-R',
    ':gp_nxtranet',
    pth,
  ]);
}

export const install = async () => {
  if (process.getuid() !== 0) {
    console.log("Install commande have to be run as root");
    process.exit(0);
  }
  const nxtDev = findNxtDev();
  await createGroupIfNotExist();
  console.log(`${sysGroup} group created.`);
  await createUserIfnotExist('nxtcore');
  await addUserToSysGroup('nxtcore');
  console.log('nxtcore user created');
  await installPackagesDeps();
  console.log('packages deps installed');
  await chownForGroup('/etc/nxtranet/packages');
  for (const dir of nxtDev.serviceDirectories) {
    const services = getServiceConfig(path.join(nxtDev._path, dir));
    for (const service of services) {
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
  }
  await configureNginx();
  console.log('nginx configured.');
  console.log('installation done, use cli to start project in development or production mode.');
}

export const configureNginx = async () => {
  await execa('cp', [nextranetNginx, '/etc/nginx/sites-available']);
  if (!fs.existsSync(path.join('/etc/nginx/sites-enabled', 'nextra.net'))) {
    await execa('ln', ['-s', '/etc/nginx/sites-available/nextra.net', '/etc/nginx/sites-enabled']);
  }
  await execa('chown', ['-R', 'nxtsrv-nginx', '/etc/nginx/sites-available']);
  await execa('chown', ['-R', 'nxtsrv-nginx', '/etc/nginx/sites-enabled']);
}
