import execa from 'execa';
import {PackageDef} from '../headers/nxtranetdev.h';
import {coreUser} from './nxtconfig';

export async function build(packageDef: PackageDef, envs?: string[]) {
  await execa('sudo', [
    '-u',
    coreUser,
    ...(envs || []),
    'npm',
    'run',
    'build'
  ], {
    stdio: ['ignore', process.stdout, process.stderr],
    cwd: packageDef.path,
  });
}
