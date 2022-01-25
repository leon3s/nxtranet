import {spawn} from 'child_process';
import path from 'path';

const child = spawn(process.argv[0], [path.join(__dirname, './service')], {
  detached: true,
  stdio: 'ignore',
});
console.log(child.pid);
