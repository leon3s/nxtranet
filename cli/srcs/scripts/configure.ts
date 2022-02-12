import {generateConfigFiles} from '../lib/config';
import {ensureRoot} from '../lib/system';

export async function configure() {
  ensureRoot();
  await generateConfigFiles();
}
