#!/usr/bin/node
import fs from 'fs';
import path from 'path';
import install from './scripts/install';
import * as run from './scripts/run';

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
