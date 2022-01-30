import {spawn} from 'child_process';
import fs from 'fs';
import path from 'path';

const logsDirPath = path.join('../../../', 'logs');

const [{ }, { }, name, sPath] = process.argv;

const fd = fs.openSync(path.join(logsDirPath, `${name}.log`), 'a');

const p = spawn('node', [sPath], {
  detached: true,
  stdio: ['ignore', fd, fd],
  env: {
    NODE_ENV: process.env.NODE_ENV,
  }
});

p.unref();

console.log(p.pid);
