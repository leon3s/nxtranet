import {spawn} from 'child_process';
import fs from 'fs';
import path from 'path';

const logsDirPath = '/etc/nxtranet/logs';

const [{ }, { }, name, sPath, cwd] = process.argv;

const fd = fs.openSync(path.join(logsDirPath, `${name}.log`), 'a');

const p = spawn('node', [sPath], {
  cwd,
  detached: true,
  stdio: ['ignore', fd, fd],
  env: {
    NODE_ENV: process.env.NODE_ENV,
  }
});

p.unref();

console.log(p.pid);
