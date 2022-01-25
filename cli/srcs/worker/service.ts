import execa from 'execa';
import fs from 'fs';
import path from 'path';
import {Server} from 'socket.io';

const logsDirPath = '/etc/nxtranet/logs';
const installPath = process.env.INSTALL_PATH || '/etc/nxtranet';
const configPath = path.join(installPath, '.nxtdev');

type ServiceDef = {
  path: string;
  main: string;
  name: string;
  user: string;
}

const services: {
  process: execa.ExecaChildProcess,
  user: string;
}[] = [];

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
}

function writeLogFile(serviceName: string, data: string) {
  const logFilename = `${serviceName}.log`;
  const logPath = path.join(logsDirPath, logFilename);
  if (fs.existsSync(logPath)) {
    fs.appendFileSync(logPath, data);
  } else {
    fs.writeFileSync(logPath, data);
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

async function startProjects(serviceDefs: ServiceDef[]) {
  for (const serviceDef of serviceDefs) {
    console.log(serviceDef);
    if (!serviceDef.main) continue;
    const child = execa('sudo', ['-u', serviceDef.user, 'node', `${path.join(serviceDef.path, serviceDef.main)}`], {
      env: {
        NODE_ENV: 'production',
      },
    });
    services.push({
      process: child,
      user: serviceDef.user,
    });
    child.stdout?.on('data', (data) => {
      console.log(`${serviceDef.name}: ${data.toString()}`);
    });
    child.stderr?.on('data', (data) => {
      console.log(`${serviceDef.name}: ${data.toString()}`);
    });
  }
}

async function killServices(signal: string) {
  for (const service of services) {
    try {
      await execa('sudo', ['-u', service.user, 'kill', `-${signal}`, `-${process.pid}`]);
    } catch (e) {
      console.error(e);
    }
  }
}

async function prepare() {
  await ensureUser('nxtcore');
  ensureDir(logsDirPath);
  const serviceDefs = getServiceDefs();
  startProjects(serviceDefs);
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
  console.log('server listening on port: ', 6587);
  // fs.writeFileSync('/etc/nxtranet/.nxtranet.pid', process.pid.toString());
  console.log('PID ', process.pid);
}).catch((err) => {
  console.error(err);
});
