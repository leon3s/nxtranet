import execa from 'execa';

async function update(branchName?: string) {
  const origin = branchName ? `origin/${branchName}` : 'origin/development';
  await execa('git', ['stash']);
  await execa('git', ['fetch', '--all']);
  await execa('git', ['rebase', origin]);
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
