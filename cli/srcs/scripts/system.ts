import execa from 'execa';
import fs from 'fs';
import path from 'path';

const sysGroup = 'gp_nxtranet';

const servicesDir = path.join(__dirname, './services');

export async function detectSystem() {
}

/** Read project service directory to know default users */
function getProjectConfigs() {
  const services = [];
  const dirNames = fs.readdirSync(servicesDir);
  for (const dirName of dirNames) {
    try {
      const nxtsrvContent = fs.readFileSync(path.join(servicesDir, dirName, '.nxtsrv')).toString();
      services.push(JSON.parse(nxtsrvContent));
    } catch (e) {
      // just skip is .nxtsrv file not exist.
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

export const install = async () => {
  if (process.getuid() !== 0) {
    console.log("Install commande have to be run as root");
    process.exit(0);
  }
  const services = getProjectConfigs();
  await createGroupIfNotExist();
  for (const service of services) {
    await createUserIfnotExist(service.user);
    await addUserToSysGroup(service.user);
  }
}
