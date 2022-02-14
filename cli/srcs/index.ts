#!/usr/bin/node
import fs from 'fs';
import path from 'path';
import {buildPackage, buildService} from './scripts/build';
import {configure} from './scripts/configure';
import install from './scripts/install';
import * as runHelper from './scripts/run';
import {stop} from './scripts/stop';
import {testService} from './scripts/test';

const help = fs.readFileSync(path.join(__dirname, '../README.md'));

const printHelp = () => {
  process.stdout.write(help);
}

(async function main() {
  const [{ }, { }, type, action, ...args] = process.argv;
  if (!type) {
    return printHelp();
  }
  if (type === 'install') {
    await install();
  }
  if (type === 'stop') {
    await stop();
  }
  if (type === 'configure') {
    await configure();
  }
  if (type === 'service' && action === 'build') {
    await buildService(args[0]);
  }
  if (type === 'service' && action === 'test') {
    await testService(args[0]);
  }
  if (type === 'package' && action === 'build') {
    await buildPackage(args[0]);
  }
  if (type === 'run') {
    if (action === 'dev') {
      await runHelper.dev();
    }
    if (action === 'prod') {
      await runHelper.prod();
    }
  }
  process.exit(0);
})().catch((err) => {
  console.error(err.message);
});
