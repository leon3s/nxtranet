#!/usr/bin/node
import fs from 'fs';
import path from 'path';
import {configure} from './scripts/configure';
import install from './scripts/install';
import * as run from './scripts/run';
import {stop} from './scripts/stop';
import {test} from './scripts/test';

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
  if (type === 'test') {
    await test(action);
  }
  if (type === 'configure') {
    await configure();
  }
  if (type === 'run') {
    if (action === 'dev') {
      await run.dev();
    }
    if (action === 'prod') {
      await run.prod();
    }
    if (action === 'windev') {
      await run.winDev();
    }
  }
  process.exit(0);
})().catch((err) => {
  console.error(err.message);
});
