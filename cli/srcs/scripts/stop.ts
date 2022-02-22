import execa from 'execa';
import fs from 'fs';
import path from 'path';
import {
  runDir
} from '../lib/nxtconfig';
import {ensureRoot} from '../lib/system';

const pidPath = path.join(runDir, 'nxtranet.pid');

async function stop() {
  ensureRoot();
  if (!fs.existsSync(pidPath)) {
    process.stdout.write('nxtranet is not running.\n');
    process.exit(0);
  }
  const pid = fs.readFileSync(pidPath, 'utf-8');
  await execa('kill', [pid]);
}

async function main() {
  await stop();
}

main().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error(err.message);
  process.exit(1);
});
