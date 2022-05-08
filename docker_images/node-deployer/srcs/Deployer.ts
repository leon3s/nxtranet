import type {
  ModelCluster, ModelPipeline, ModelPipelineCmd
} from '@nxtranet/headers';
import EventEmitter from 'events';
import execa from 'execa';
import path from 'path';
import {writeProjectCache} from './projectCache';
import ProjectDownloader from './ProjectDownloader';

type Cmd = {
  exe: string;
  cwd: string;
  args: string[];
  env: Record<string, string>;
}

type ClusterData = {
  pipelines: ModelPipeline[];
  lastCommand: ModelPipelineCmd;
  envVars: Record<string, string>;
}

/**
 * @class Deployer
 */
export default class Deployer {
  tmpDir: string;
  projectDownloader: ProjectDownloader;
  emitter = new EventEmitter();
  project: execa.ExecaChildProcess;
  lastCommand: ModelPipelineCmd;
  projectDir: string;

  constructor(tmpDirPath: string) {
    this.tmpDir = tmpDirPath;
    this.projectDownloader = new ProjectDownloader(tmpDirPath);
  }

  private hookCmd = (cmd: Cmd) => {
    const {exe, args, cwd, env} = cmd;
    console.log(`> ${exe} ${args.join(' ')}`);
    const child = execa(exe, args, {
      cwd,
      env,
    });
    child.stdout.on("data", (d) => {
      console.log(d.toString());
      this._emitAction('cmd', {
        exe,
        cwd,
        args,
        isLast: false,
        isFirst: false,
        stdout: d.toString(),
      });
    });
    child.stderr.on("data", (d) => {
      console.log(d.toString());
      this._emitAction('cmd', {
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

  private spawnCmd = async (cmd: Cmd) => {
    const {exe, args, cwd} = cmd;
    this._emitAction('cmd', {
      exe,
      cwd,
      args,
      isLast: false,
      isFirst: true,
    });
    try {
      const pchild = this.hookCmd(cmd);
      const child = await pchild;
      this._emitAction('cmd', {
        exe,
        cwd,
        args,
        isLast: true,
        isFirst: false,
        signal: child.signal,
        exitCode: child.exitCode,
        signalDescription: child.signalDescription,
      });
      return child;
    } catch (e) {
      this._emitAction('cmd', {
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

  private launchPipeline = async (projectDir: string, pipeline: ModelPipeline, envVars: Record<string, string>) => {
    const {commands} = pipeline;
    for (let command of commands) {
      await this.spawnCmd({
        exe: command.name,
        args: command.args,
        env: envVars,
        cwd: projectDir,
      });
    }
  }

  private launchPipelines = async (projectDir: string, pipelines: ModelPipeline[], envVars: Record<string, string>) => {
    for (let pipeline of pipelines) {
      try {
        this._emitAction('pipelineStatus', {
          pipelineNamespace: pipeline.namespace,
          value: 'starting',
        });
        if (pipeline.commands.length) {
          await this.launchPipeline(projectDir, pipeline, envVars);
          this._emitAction('pipelineStatus', {
            pipelineNamespace: pipeline.namespace,
            value: 'passed',
          });
        }
      } catch (e) {
        this._emitAction('pipelineStatus', {
          pipelineNamespace: pipeline.namespace,
          value: 'failed',
          error: JSON.stringify(e),
        });
        throw e;
      }
    }
  }

  private _extractClusterData = (cluster: ModelCluster): ClusterData => {
    const {pipelines} = cluster;
    const lastCommand = pipelines[pipelines.length - 1].commands.pop();
    const envVars = cluster.envVars?.reduce((acc, env) => {
      acc[env.key] = env.value;
      return acc;
    }, {}) || undefined;
    return {
      pipelines: pipelines,
      lastCommand,
      envVars,
    }
  }

  private _dwExProject = async (
    cluster: ModelCluster,
    branch: string,
  ): Promise<string> => {
    this._emitAction('cmd', {
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
    this._emitAction('cmd', {
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
    return projectDir;
  }

  private _startDeploy = async (cluster: ModelCluster, branch: string) => {
    try {
      this.projectDir = await this._dwExProject(cluster, branch);
    } catch (e) {
      this._emitAction('cmd', {
        exe: 'dw',
        isFirst: false,
        isLast: true,
        cwd: process.cwd(),
        args: ['branch', branch],
        stderr: e.message,
      });
    }
    const clusterData = this._extractClusterData(cluster);
    const {pipelines, envVars, lastCommand} = clusterData;
    await this.launchPipelines(this.projectDir, pipelines, envVars);
    this.lastCommand = lastCommand;
    writeProjectCache(lastCommand, envVars, this.projectDir);
    this.start(lastCommand, envVars, this.projectDir);
  }

  public start = (cmd: ModelPipelineCmd, envVars: Record<string, string>, projectDir: string) => {
    this._emitAction('cmd', {
      exe: cmd.name,
      cwd: projectDir,
      args: cmd.args,
      isLast: false,
      isFirst: true,
    });
    setTimeout(() => {
      this.project = this.hookCmd({
        exe: cmd.name,
        args: cmd.args,
        env: envVars,
        cwd: projectDir,
      });
      this.project.then((child) => {
        this._emitAction('cmd', {
          exe: cmd.name,
          cwd: projectDir,
          args: cmd.args,
          isLast: true,
          isFirst: false,
          signal: child.signal,
          exitCode: child.exitCode,
          signalDescription: child.signalDescription,
        });
      })
      this.project.catch((err) => {
        this._emitAction('cmd', {
          exe: cmd.name,
          cwd: projectDir,
          args: cmd.args,
          isLast: true,
          isFirst: false,
          signal: err.signal,
          exitCode: err.exitCode,
          signalDescription: err.signalDescription,
        });
        this._emitAction('pipelineStatus', {
          pipelineNamespace: cmd.pipelineNamespace,
          value: 'failed',
          error: JSON.stringify(err),
        });
      });
    }, 200);
  }

  private _emitAction = (type: string, payload: any) => {
    this.emitter.emit('action', {
      type,
      payload,
    });
  }

  public deploy = async (cluster: ModelCluster, branch: string) => {
    this._startDeploy(cluster, branch).catch((err) => {
      this._emitAction('error', err);
    });
    return {
      status: 200,
    };
  }
}
