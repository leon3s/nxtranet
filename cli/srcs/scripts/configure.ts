import {generateConfigFiles} from '../lib/config';
import {ensureRoot} from '../lib/system';

async function configure() {
  ensureRoot();
  await generateConfigFiles();
}

async function main() {
  await configure();
}

main().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error(err.message);
  process.exit(1);
});
