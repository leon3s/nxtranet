import execa from 'execa';
import {getBuildConfig} from '../lib/nxtconfig';
import {chownPackagesDirectories, chownService} from '../lib/system';

async function update(branchName?: string) {
  const origin = branchName ? `origin/${branchName}` : 'origin/development';
  await execa('git', ['stash'], {
    cwd: __dirname,
  });
  await execa('git', ['fetch', '--all'], {
    cwd: __dirname,
  });
  await execa('git', ['rebase', origin], {
    cwd: __dirname,
  });
  const nxtconfig = await getBuildConfig();
  await chownPackagesDirectories(nxtconfig);
  await Promise.all(nxtconfig.services.map((service) => {
    return chownService(service);
  }));
  console.log('Update done, you may have to reinstall or reconfigure.');
}

async function main() {
  const [{ }, { }, branchName] = process.argv;
  await update(branchName);
}

main().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error(err.message);
  process.exit(1);
});
