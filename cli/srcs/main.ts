#!/usr/bin/node

import fs from 'fs';
import path from 'path';
import * as service from './service';

const help = fs.readFileSync(path.join(__dirname, '../README.md'));

const printHelp = () => {
  process.stdout.write(help);
}

(async function main() {
  const [{}, _name, type, action, ...args] = process.argv;
  if (!type) {
    return printHelp();
  }
  if (type === 'services') {
    if (action === 'start') {
      await service.start(args[0], args[1]);
    }
  }
  process.exit(0);
})().catch((err) => {
  console.error(err.message);
});