import execa from 'execa';
import fs from 'fs';
import path from 'path';

const sysGroup = 'gp_nxtranet';

/** TODO detect system to change installation */
export async function detectSystem() { }

/** Read project service directory to know default users */
function getProjectConfigs(dir: string) {
  const services = [];
  const dirNames = fs.readdirSync(dir);
  for (const dirName of dirNames) {
    try {
      const nxthatdev_pjContent = fs.readFileSync(path.join(dir, dirName, '.nxthatdev_pj')).toString();
      services.push(JSON.parse(nxthatdev_pjContent));
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

export const install = async () => {
  if (process.getuid() !== 0) {
    console.log("Install commande have to be run as root");
    process.exit(0);
  }
  const nxtDev = findNxtDev();
  for (const dir of nxtDev.projectDirectories) {
    const services = getProjectConfigs(path.join(nxtDev._path, dir));
    console.log(services);
    await createGroupIfNotExist();
    for (const service of services) {
      await createUserIfnotExist(service.user);
      await addUserToSysGroup(service.user);
    }
  }
}
