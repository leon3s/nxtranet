import fs from 'fs';
import path from 'path';
import type {
  NxtdevConfig, NxthatPJ, Pkgjson, Project
} from '../headers/nxtranetdev.h';

const cwd = process.cwd();

export const readFile = (filePath: string): string | null => {
  try {
    return fs.readFileSync(filePath).toString();
  } catch (e) {
    return null;
  }
}

export const readNxthatdevPJ = (projectPath: string): NxthatPJ | null => {
  const content = readFile(path.join(projectPath, '.nxthatdev_pj'));
  if (!content) return null;
  try {
    return JSON.parse(content);
  } catch (e: any) {
    console.error(`${projectPath}/.nxthatdev_pj is incorrect`, e.message);
    process.exit(2);
  }
}

export const readPkgjson = (projectPath: string): Pkgjson | null => {
  const content = readFile(path.join(projectPath, 'package.json'));
  if (!content) return null;
  try {
    return JSON.parse(content);
  } catch (e: any) {
    console.error(`${projectPath}/package.json is incorrect`, e.message);
    process.exit(2);
  }
}

export const readProjectConf = (projectPath: string): Project => {
  return {
    _path: projectPath,
    pkg: readPkgjson(projectPath),
    settings: readNxthatdevPJ(projectPath),
  }
}

export const getNxtdevConfig = (pathrecur: string = cwd): NxtdevConfig | null => {
  if (pathrecur === "/") return null;
  const nxtdevConfPath = path.join(pathrecur, '.nxtdev');
  const content = readFile(nxtdevConfPath);
  if (!content) return getNxtdevConfig(path.join(pathrecur, '..'));
  try {
    const nxtdevConfig = JSON.parse(content);
    nxtdevConfig._path = pathrecur;
    return nxtdevConfig;
  } catch (e: any) {
    console.error(".nxtdev is incorrect", e.message);
    return null;
  }
}
