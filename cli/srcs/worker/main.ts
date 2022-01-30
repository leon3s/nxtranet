import execa from 'execa';
import fs from 'fs';
import path from 'path';
import {Server} from 'socket.io';
import type {ServiceDef} from '../headers/nxtranetdev.h';
import {getConfig} from '../lib/nxtconfig';
import {ensureUser} from '../lib/system';

const services: {
  pid: number;
  user: string;
}[] = [];

async function buildService(serviceDef: ServiceDef) {
  await execa('sudo', [
    `NODE_ENV=${process.env.NODE_ENV}`,
    '-u',
    serviceDef.user,
    'npm',
    'run',
    'build',
  ], {
    stdio: ['ignore', process.stdout, process.stderr],
    cwd: serviceDef.path,
  });
}

async function startService(serviceDef: ServiceDef) {
  const runnerPath = path.join(__dirname, './runner');
  const child = await execa('sudo', [
    `NODE_ENV=${process.env.NODE_ENV}`,
    '-u',
    serviceDef.user,
    'node',
    runnerPath,
    serviceDef.name,
    `${path.join(serviceDef.path, serviceDef.pkg.main)}`,
  ], {
    cwd: serviceDef.path,
  });
  return +child.stdout;
}

async function startServices(serviceDefs: ServiceDef[]) {
  Promise.all<void>(serviceDefs.map(async (serviceDef) => {
    if (!serviceDef.pkg.main) {
      console.warn(`Service ${serviceDef.name} doesn't have main defined in package.json cannot start.`);
      return;
    }
    if (process.env.NODE_ENV !== 'development' || !serviceDef.skipDevBuild) {
      await buildService(serviceDef);
    }
    const pid = await startService(serviceDef);
    console.log('Service :\t', serviceDef.name, '\tstarted with pid :\t', pid);
    services.push({
      pid,
      user: serviceDef.user,
    });
  }));
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
  const nxtconfig = await getConfig();
  startServices(nxtconfig.services);
}

prepare().then(() => {
  const server = new Server(6587);
  server.on('connection', (socket) => { });
  console.log('master process started listening on port : ', 6587, ' with pid ', process.pid);
  fs.writeFileSync('/etc/nxtranet/.nxtranet.pid', process.pid.toString());
}).catch((err) => {
  console.error(err);
});

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
