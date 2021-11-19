import fs from 'fs';
import os from 'os';
import path from 'path';

const configFile = path.join(os.homedir(), '.nextranet_subdomain');

if (!fs.existsSync(configFile)) {
  fs.writeFileSync(configFile, JSON.stringify({}));
}

export const watchConfig = (callback) => {
  fs.watchFile(configFile, () => {
    callback(readConfig());
  });
}

export const readConfig = () => {
  const data = JSON.parse(fs.readFileSync(configFile).toString());
  return data;
}
