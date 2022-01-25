import type {ExecaChildProcess} from 'execa';
import execa from 'execa';
import fs from 'fs';
import path from 'path';
import type {
  Project
} from '../headers/nxtranetdev.h';
import {
  ensureRoot,
  getNxtdevConfig,
  readProjectConf
} from '../lib/config';
import {
  execaWsl
} from '../lib/system';

const projectProcess: ExecaChildProcess[] = [];

const getProjects = () => {
  const nxtdevConfig = getNxtdevConfig();
  console.log(nxtdevConfig);
  if (!nxtdevConfig) {
    process.exit(0);
  }
  const projects = [];
  const {projectDirectories} = nxtdevConfig;
  console.log(projectDirectories);
  for (const projectDir of projectDirectories) {
    console.log(projectDir);
    const projectDirPath = path.join(nxtdevConfig._path, projectDir);
    const projectDirNames = fs.readdirSync(projectDirPath);
    for (const projectDirName of projectDirNames) {
      console.log(projectDirName);
      const project = readProjectConf(path.join(projectDirPath, projectDirName));
      projects.push(project);
    }
  }
  return projects;
}

const startProject = async (project: Project, mod?: "dev") => {
  let command = mod === 'dev' ? ['run', 'dev'] : ['start'];
  if (mod === 'dev') {
    const res = await execaWsl('npm', command, {
      env: process.env,
      cwd: project._path,
      detached: true,
      username: project.settings?.user,
      windowTitle: project.pkg?.name,
    });
    console.log(res);
  }
}

const stopProject = (id: number) => {
  projectProcess[id].cancel();
  projectProcess[id].kill();
}

export const dev = async () => {
  if (process.platform !== 'win32') {
    ensureRoot();
  }
  const projects = getProjects();
  for (const i in projects) {
    const project = projects[i];
    const {settings, _path} = project;
    console.log(project);
    if (!settings) continue; // Ignore no seetings for now //
    const {watchDirectories} = settings;
    console.log(watchDirectories);
    if (watchDirectories?.length) {
      console.log('WATCH DIRECTORIES');
      for (const watchDir of watchDirectories) {
        fs.watch(path.join(_path, watchDir), () => {
          stopProject(+i);
          startProject(project, "dev");
        });
      }
    }
    await startProject(project, "dev");
  }
}


export const prod = async () => {
  ensureRoot();
  const res = execa('sudo', ['-u', 'nxtcore', 'node', '/etc/nxtranet/core/runner/dist/service.js'], {
    detached: true,
    stdio: 'ignore',
  });
  res.unref();
}
