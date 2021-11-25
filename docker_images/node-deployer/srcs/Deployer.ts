import path from 'path';
import execa from 'execa';
import crypto from 'crypto';

import ProjectDownloader from './ProjectDownloader';

import type { Socket } from 'socket.io';
import type {
  ModelEnvVar,
  ModelCluster,
  ModelPipeline,
} from '@nxtranet/headers';

type SocketEmiter = (action:string, data:any) => void;

type Cmd = {
  exe: string;
  cwd: string;
  args: string[];
  env: Record<string, string | number>;
  // envVars: 
}

type Action = {
  type: string;
  payload: any;
}

/**
 * @class Deployer
 */
export default class  Deployer {
  tmpDir:             string;
  socketEmiter:       SocketEmiter;
  projectDownloader:  ProjectDownloader;

  constructor(tmpDirPath: string) {
    this.tmpDir = tmpDirPath;
    this.projectDownloader = new ProjectDownloader(tmpDirPath);
  }

  hookCmd = (cmd: Cmd) => {
    const {exe, args, cwd, env} = cmd;
    const child = execa(exe, args, {
      cwd,
      env: {
        ...env,
        TEST_VALUE: 'gg',
      },
    });
    child.stdout.on("data", (d) => {
      this.socketEmiter('cmd', {
        exe,
        cwd,
        args,
        isLast: false,
        isFirst: false,
        stdout: d.toString(),
      });
    });
    child.stderr.on("data", (d) => {
      this.socketEmiter('cmd', {
        exe,
        cwd,
        args,
        isLast: false,
        isFirst: false,
        stderr: d.toString(),
      });
    });
    return child;
  }

  /**
   * 
   * @param cmd Command to execute
   * @returns child process
   */
  spawnCmd = async (cmd: Cmd) => {
    const {exe, args, cwd} = cmd;
    this.socketEmiter('cmd', {
      exe,
      cwd,
      args,
      isLast: false,
      isFirst: true,
    });
    try {
      const child = await this.hookCmd(cmd);
      this.socketEmiter('cmd', {
        exe,
        cwd,
        args,
        isLast: true,
        isFirst: false,
        signal: child.signal,
        exitCode: child.exitCode,
        signalDescription: child.signalDescription,
      });
    } catch (e) {
      this.socketEmiter('cmd', {
        exe,
        cwd,
        args,
        isLast: true,
        isFirst: false,
        signal: e.signal,
        exitCode: e.exitCode,
        signalDescription: e.signalDescription,
      });
      throw e;
    }
  }

  launchPipeline = async (projectDir: string, pipeline: ModelPipeline, envVars: ModelEnvVar[]) => {
    const {commands} = pipeline;
    for (let command of commands) {
      await this.spawnCmd({
        exe: command.name,
        args: command.args,
        env: envVars.reduce((acc, env) => {
          acc[env.key] = env.value;
          return acc;
        }, {}),
        cwd: projectDir,
      });
    }
  }

  launchPipelines = async (projectDir: string, pipelines: ModelPipeline[], envVars: ModelEnvVar[]) => {
    for (let pipeline of pipelines) {
      try {
        this.socketEmiter('pipelineStatus', {
          pipelineNamespace: pipeline.namespace,
          value: 'starting',
        });
        await this.launchPipeline(projectDir, pipeline, envVars);
        this.socketEmiter('pipelineStatus', {
          pipelineNamespace: pipeline.namespace,
          value: 'passed',
        });
      } catch (e) {
        this.socketEmiter('pipelineStatus', {
          pipelineNamespace: pipeline.namespace,
          value: 'failed',
          error: JSON.stringify(e),
        });
      }
    }
  }

  startDeploy = async (cluster: ModelCluster, branch: string) => {
    this.socketEmiter('cmd', {
      exe: 'dw',
      isFirst: true,
      isLast: false,
      cwd: process.cwd(),
      args: ['branch', branch],
    });
    const {project} = cluster;
    const {fileName, filePath} = await this.projectDownloader.github({
      username: project.github_username,
      password: project.github_password,
    }, project.github_project, branch);
    this.socketEmiter('cmd', {
      exe: 'dw',
      isFirst: false,
      isLast: true,
      cwd: process.cwd(),
      args: ['branch', branch],
    });
    const projectDir = path.join(this.tmpDir, fileName.replace('.tar.gz', ''));
    await this.spawnCmd({
      exe: 'tar',
      cwd: this.tmpDir,
      args: ['-xf', filePath],
      env: {},
    });
    return this.launchPipelines(projectDir, cluster.project.pipelines, cluster.envVars);
  }

  deploy = async (socket:Socket, cluster: ModelCluster, branch:string) => {
    const genID = crypto.randomBytes(2).toString('hex');
    const emiterPath = `${cluster.project.name}-${branch}-${genID}`;
    this.socketEmiter = (type:string, payload:any) => {
      socket.emit(emiterPath, {
        type,
        payload,
      });
    }
    setTimeout(() => {
      this.startDeploy(cluster, branch).catch((err) => {
        console.error('startDeploy global error:', err);
      })
    }, 2000);
    return {
      status: 200,
      payload: {
        statusUrl: emiterPath,
      },
    };
  }
}
