import execa from 'execa';
import path from 'path';
import {
  runDir
} from '../lib/nxtconfig';
import {
  ensureRoot, ensureRunDir
} from '../lib/system';

const dev = async () => {
  ensureRoot();
  ensureRunDir(runDir);
  await execa('sudo', [
    'NODE_ENV=development',
    '-u',
    'nxtcore',
    'node',
    path.join(__dirname, '../deamon/index.js')], {
    stdio: ['ignore', process.stdout, process.stderr],
  });
}

const prod = async (isAttached?: boolean) => {
  ensureRoot();
  ensureRunDir(runDir);
  const stdio: ['ignore'] | 'ignore' = isAttached ? ['ignore'] : 'ignore';
  const res = execa('sudo', [
    'NODE_ENV=production',
    '-u',
    'nxtcore',
    'node',
    path.join(__dirname, '../deamon/index.js')], {
    detached: true,
    stdio,
  });
  if (!isAttached)
    res.unref();
}

async function main() {
  const [{ }, { }, mod] = process.argv;
  if (mod === 'dev') {
    await dev();
    process.exit(0);
  }
  const isAttached = mod === '--attach';
  await prod(isAttached);
}

main().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error(err.message);
  process.exit(1);
});
