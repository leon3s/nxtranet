import fs from 'fs';
import path from 'path';

const runPath = '/etc/nxtranet/run';

export function ensureRunDir() {
  if (!fs.existsSync(runPath))
    fs.mkdirSync(runPath);
}

export function writePid(name: string) {
  fs.writeFileSync(path.join(runPath, name, '.pid'), process.pid.toString());
}

export function deletePid(name: string) {
  fs.rmSync(path.join(runPath, name, '.pid'));
}
