#!/usr/bin/node
import fs from 'fs';
import path from 'path';
import * as run from './scripts/run';
import * as system from './scripts/system';

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
    await system.install();
  }
  if (type === 'run') {
    if (action === 'dev') {
      await run.dev();
    }
  }
  process.exit(0);
})().catch((err) => {
  console.error(err.message);
});
