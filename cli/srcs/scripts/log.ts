import fs from 'fs';
import path from 'path';
import {logsDir} from '../lib/nxtconfig';

async function printLog(serviceName: string) {
  const logPath = path.join(logsDir, `${serviceName}.log`);
  if (!fs.existsSync(logPath)) {
    const err = new Error('Log path not exist.');
    err.message = `Log for ${serviceName} is not found, is service running ?`;
    throw err;
  }
  const logData = fs.readFileSync(logPath, 'utf-8');
  console.log(logData);
}

async function main() {
  const [{ }, { }, serviceName] = process.argv;
  if (!serviceName) {
    const err = new Error('Service not defined');
    err.message = `Service name is required\nUsage: nxtranet log {serviceName}`;
    throw err;
  }
  await printLog(serviceName);
}

main().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error(err.message);
  process.exit(1);
});
