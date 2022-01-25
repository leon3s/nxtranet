import execa from 'execa';
import fs from 'fs';
import path from 'path';
import {Server} from 'socket.io';

const logsDirPath = '/etc/nxtranet/logs';
const installPath = process.env.INSTALL_PATH || '/etc/nxtranet';
const configPath = path.join(installPath, '.nxtdev');

type ProjectDef = {
  path: string;
  main: string;
  name: string;
  user: string;
}

const projectProcess: {
  process: execa.ExecaChildProcess,
  user: string;
}[] = [];

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
}

function writeLogFile(projectName: string, data: string) {
  const logFilename = `${projectName}.log`;
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

function readNxtpConf(projectPath: string) {
  const nxtpconfPath = path.join(projectPath, '.nxthatdev_pj');
  try {
    const nxtpconf = readJson(nxtpconfPath);
    return nxtpconf;
  } catch (e) {
    return null;
  }
}

function getProjectDefs(): ProjectDef[] {
  const projectDefs: ProjectDef[] = [];
  const config = readJson(configPath);
  for (let projectDir of config.projectDirectories) {
    const projectDirPath = path.join(installPath, projectDir);
    const projects = fs.readdirSync(projectDirPath);
    for (let project of projects) {
      const projectPath = path.join(projectDirPath, project);
      const pkg = readJson(path.join(projectPath, 'package.json'));
      const nxtpConf = readNxtpConf(projectPath);
      if (!nxtpConf) continue;
      projectDefs.push({
        user: nxtpConf.user,
        path: projectPath,
        main: pkg.main,
        name: pkg.name,
      });
    }
  }
  return projectDefs;
}

async function startProjects(projectDefs: ProjectDef[]) {
  for (let projectDef of projectDefs) {
    const child = execa('sudo', ['-u', projectDef.user, 'node', `${path.join(projectDef.path, projectDef.main)}`], {
      env: {
        NODE_ENV: 'production',
      },
    });
    projectProcess.push({
      process: child,
      user: projectDef.user,
    });
    child.stdout?.on('data', (data) => {
      const filename = projectDef.name.split('/').pop() as string;
      writeLogFile(filename, data.toString());
      console.log(`${projectDef.name}: ${data.toString()}`);
    });
    child.stderr?.on('data', (data) => {
      const filename = projectDef.name.split('/').pop() as string;
      writeLogFile(filename, data.toString());
      console.log(`${projectDef.name}: ${data.toString()}`);
    });
  }
}

async function clearProcess() {
  for (const project of projectProcess) {
    const {process, user} = project;
    if (process.pid) {
      await execa('sudo', ['-u', user, 'kill', process.pid.toString()]);
      console.log('clearing process');
    }
  }
}

async function prepare() {
  await ensureUser('nxtcore');
  ensureDir(logsDirPath);
  const projectDefs = getProjectDefs();
  startProjects(projectDefs);
}

prepare().then(() => {
  const server = new Server(6587);
  server.on('connection', (socket) => { });
  console.log('server listening on port: ', 6587);
  fs.writeFileSync('/etc/nxtranet/.nxtranet.pid', process.pid.toString());
  console.log('PID ', process.pid);
}).catch((err) => {
  console.error(err);
});

process.on('exit', async () => {
  console.log('exit');
});

process.on('SIGINT', async () => {
  console.log('SIGINT');
  await clearProcess();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM');
  await clearProcess();
  process.exit(0);
});
