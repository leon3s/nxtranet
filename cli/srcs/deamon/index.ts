import execa from 'execa';
import fs from 'fs';
import path from 'path';
import {Server} from 'socket.io';
import type {ServiceDef} from '../headers/nxtranetdev.h';
import {getBuildConfig, runDir} from '../lib/nxtconfig';
import getUserConfig, {userConfigToEnv} from '../lib/nxtUserconfig';
import * as serviceHelper from '../lib/service';
import {ensureUser} from '../lib/system';

const PORT = +(process.env.PORT || 6587);

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
    if (process.env.NODE_ENV === 'development') {
      const service = serviceHelper.start(serviceDef, envs);
      service.stderr?.on('data', (data) => {
        console.error(`[${serviceDef.name}]`);
        console.error(`> ${data.toString()}`);
      });
      service.stdout?.on('data', (data) => {
        console.log(`[${serviceDef.name}]`);
        console.log(`> ${data.toString()}`);
      });
    } else {
      const pid = await serviceHelper.startWithRunner(serviceDef, envs);
      services.push({
        pid: pid || 0,
        user: serviceDef.user,
      });
    }
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
  const server = new Server(PORT);
  server.on('connection', (socket) => { });
  console.log(`[nxtranet][${process.pid}] deamon started on [::1]:${PORT}`);
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
