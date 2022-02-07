import {spawn} from 'child_process';
import fs from 'fs';
import path from 'path';
import {logsDir} from '../lib/nxtconfig';

const [{ }, { }, name, sPath] = process.argv;

const fd = fs.openSync(path.join(logsDir, `${name}.log`), 'a');

const p = spawn('node', [sPath], {
  detached: true,
  stdio: ['ignore', fd, fd],
  env: process.env,
});

p.unref();

console.log(p.pid);
