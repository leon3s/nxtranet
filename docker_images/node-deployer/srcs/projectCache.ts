import {ModelPipelineCmd} from '@nxtranet/headers';
import fs from 'fs';
import os from 'os';
import path from 'path';

const homedir = os.homedir();

export const restartCachePath = path.join(homedir, '.node_deployer_restart_cache');

export const writeProjectCache = (cmd: ModelPipelineCmd, envVars: Record<string, string>, projectPath: string) => {
  fs.writeFileSync(restartCachePath, JSON.stringify({
    cmd,
    envVars,
    projectPath,
  }));
}

export const readProjectCache = () => {
  if (fs.existsSync(restartCachePath)) {
    return JSON.parse(fs.readFileSync(restartCachePath).toString());
  }
  return null;
}
