import execa from 'execa';
import fs from 'fs';
import path from 'path';
import {Server} from 'socket.io';
import type {ServiceDef} from '../headers/nxtranetdev.h';
import {getBuildConfig, runDir} from '../lib/nxtconfig';
import getUserConfig, {userConfigToEnv} from '../lib/nxtUserconfig';
import * as serviceHelper from '../lib/service';
import {ensureUser} from '../lib/system';

const pidPath = path.join(runDir, 'nxtranet.pid');

let exitAsked = false;

const services: {
  pid: number;
  user: string;
}[] = [];

async function startServices(serviceDefs: ServiceDef[], envs: string[]) {
  for (const serviceDef of serviceDefs) {
    if (!serviceDef.pkg.main) {
      console.warn(`Service ${serviceDef.name} doesn't have main defined in package.json cannot start.`);
      return;
    }
    if (process.env.NODE_ENV !== 'development' || !serviceDef.skipDevBuild) {
      await serviceHelper.build(serviceDef, envs);
    }
    const pid = await serviceHelper.start(serviceDef, envs);
    console.log('Service :\t', serviceDef.name, '\t\tstarted with pid :\t\t', pid);
    services.push({
      pid,
      user: serviceDef.user,
    });
  }
}

async function killServices(signal: string) {
  fs.rmSync(pidPath);
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
  const nxtconfig = await getBuildConfig();
  const userConfig = getUserConfig();
  const envs = userConfigToEnv(userConfig);
  startServices(nxtconfig.services, envs);
}

prepare().then(() => {
  const server = new Server(6587);
  server.on('connection', (socket) => { });
  console.log('master process started listening on port : ', 6587, ' with pid ', process.pid);
  fs.writeFileSync(pidPath, process.pid.toString());
}).catch((err) => {
  console.error(err);
});

process.on('SIGINT', async () => {
  if (!exitAsked) {
    exitAsked = true;
    await killServices('SIGINT');
    process.exit(0);
  }
});

process.on('SIGTERM', async () => {
  if (!exitAsked) {
    exitAsked = true;
    await killServices('SIGTERM');
    process.exit(0);
  }
});
