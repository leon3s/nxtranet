import execa from 'execa';
import fs from 'fs';
import path from 'path';
import {Server} from 'socket.io';

const logsDirPath = '/etc/nxtranet/logs';
const installPath = process.env.INSTALL_PATH || '/etc/nxtranet';
const configPath = path.join(installPath, '.nxtdev');

type AnyAction = {
  type: string;
  payload: any;
}

type ServiceDef = {
  path: string;
  main: string;
  name: string;
  user: string;
}

const services: {
  pid: number;
  user: string;
}[] = [];

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
}



async function ensureUser(user: string): Promise<void> {
  const res = await execa('whoami', []);
  if (res.stdout !== user) {
    throw new Error('User not matching.');
  }
}

function readJson(path: string) {
  return JSON.parse(fs.readFileSync(path).toString());
}

function readNxtpConf(servicePath: string) {
  const nxtpconfPath = path.join(servicePath, '.nxthatdev_pj');
  try {
    const nxtpconf = readJson(nxtpconfPath);
    return nxtpconf;
  } catch (e) {
    return null;
  }
}

function getServiceDefs(): ServiceDef[] {
  const serviceDefs: ServiceDef[] = [];
  const config = readJson(configPath);
  for (let serviceDir of config.serviceDirectories) {
    const serviceDirPath = path.join(installPath, serviceDir);
    const services = fs.readdirSync(serviceDirPath);
    for (let service of services) {
      const servicePath = path.join(serviceDirPath, service);
      const pkg = readJson(path.join(servicePath, 'package.json'));
      const nxtpConf = readNxtpConf(servicePath);
      if (!nxtpConf) continue;
      serviceDefs.push({
        user: nxtpConf.user,
        path: servicePath,
        main: pkg.main,
        name: pkg.name,
      });
    }
  }
  return serviceDefs;
}

async function startService(serviceDef: ServiceDef) {
  const runnerPath = path.resolve(path.join(__dirname, './runner'));
  const serviceName = serviceDef.name.split('/').pop() as string;
  const child = await execa('sudo', [
    '-u',
    serviceDef.user,
    'node',
    runnerPath,
    serviceName,
    `${path.join(serviceDef.path, serviceDef.main)}`,
    serviceDef.path,
  ], {
    env: {
      NODE_ENV: process.env.NODE_ENV || 'development',
    },
  });
  return +child.stdout;
}

async function startServices(serviceDefs: ServiceDef[]) {
  for (const serviceDef of serviceDefs) {
    if (!serviceDef.main) continue;
    const pid = await startService(serviceDef);
    console.log('Service :\t', serviceDef.name, '\tstarted with pid :\t', pid);
    services.push({
      pid,
      user: serviceDef.user,
    });
  }
}

async function killServices(signal: string) {
  fs.rmSync('/etc/nxtranet/.nxtranet.pid');
  for (const service of services) {
    try {
      await execa('sudo', ['-u', service.user, 'kill', `-${signal}`, `${service.pid}`]);
    } catch (e) {
      console.error(e);
    }
  }
}

async function prepare() {
  await ensureUser('nxtcore');
  ensureDir(logsDirPath);
  const serviceDefs = getServiceDefs();
  startServices(serviceDefs);
}

process.on('SIGINT', async () => {
  console.log('SIGINT');
  await killServices('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM');
  await killServices('SIGTERM');
  process.exit(0);
});

prepare().then(() => {
  const server = new Server(6587);
  server.on('connection', (socket) => { });
  console.log('master process started listening on port : ', 6587, ' with pid ', process.pid);
  fs.writeFileSync('/etc/nxtranet/.nxtranet.pid', process.pid.toString());
}).catch((err) => {
  console.error(err);
});
