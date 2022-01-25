import execa from 'execa';
import fs from 'fs';
import path from 'path';

const sysGroup = 'gp_nxtranet';

const nextranetNginx = path.resolve(path.join(__dirname, '../../../config/nginx/nextra.net'));

/** TODO detect system to change installation */
export async function detectSystem() { }

/** Read project service directory to know default users */
function getProjectConfigs(dir: string) {
  const services = [];
  const dirNames = fs.readdirSync(dir);
  for (const dirName of dirNames) {
    try {
      const service = {
        path: path.join(dir, dirName),
      };
      const nxthatdev_pjContent = fs.readFileSync(path.join(service.path, '.nxthatdev_pj')).toString();
      services.push({
        ...service,
        ...JSON.parse(nxthatdev_pjContent),
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

export const installDeps = (projectDir: string) => {
  return execa('npm', ['install'], {
    cwd: projectDir,
  });
}

export const install = async () => {
  if (process.getuid() !== 0) {
    console.log("Install commande have to be run as root");
    process.exit(0);
  }
  const nxtDev = findNxtDev();
  await createUserIfnotExist('nxtcore');
  await addUserToSysGroup('nxtcore');
  for (const dir of nxtDev.projectDirectories) {
    const services = getProjectConfigs(path.join(nxtDev._path, dir));
    await createGroupIfNotExist();
    for (const service of services) {
      await createUserIfnotExist(service.user);
      await addUserToSysGroup(service.user);
      try {
        await installDeps(service.path);
      } catch (err: any) {
        console.error('Error while installing dependencies for ', service.path, err.stderr);
      }
    }
  }
  await configureNginx();
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
