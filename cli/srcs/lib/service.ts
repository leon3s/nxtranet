import execa from 'execa';
import path from 'path';
import type {ServiceDef} from '../headers/nxtranetdev.h';

export async function build(service: ServiceDef, envs?: string[]) {
  await execa('sudo', [
    '-u',
    service.user,
    ...(envs || []),
    'npm',
    'run',
    'build'
  ], {
    stdio: ['ignore', process.stdout, process.stderr],
    cwd: service.path,
  });
}

export async function test(service: ServiceDef, envs?: string[]) {
  await execa('sudo', [
    '-u',
    service.user,
    ...(envs || []),
    'npm',
    'run',
    'test',
  ], {
    cwd: service.path,
    stdio: ['ignore', process.stdout, process.stderr],
  });
}

export function start(serviceDef: ServiceDef, envs: string[]) {
  return execa('sudo', [
    '-u',
    serviceDef.user,
    ...(envs || []),
    'node',
    `${path.join(serviceDef.path, serviceDef.pkg.main)}`,
  ], {
    cwd: serviceDef.path,
    stdio: ['ignore'],
  });
}

export async function startWithRunner(serviceDef: ServiceDef, envs: string[]) {
  const runnerPath = path.join(__dirname, './runner');
  const child = await execa('sudo', [
    ...envs,
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
