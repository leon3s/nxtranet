import type {NginxAccessLog, NginxSiteAvailable} from '@nxtranet/headers';
import execa from 'execa';
import fs from 'fs';
import path from 'path';

const errorLogPath = '/var/log/nginx/error.log';
const accessLogPath = '/var/log/nginx/access.log';
const siteEnabledPath = '/etc/nginx/sites-enabled';
const siteAvailablePath = '/etc/nginx/sites-available';

export const getSitesAvailable = (): NginxSiteAvailable[] => {
  const siteAvailables: NginxSiteAvailable[] = [];
  const files = fs.readdirSync(siteAvailablePath);
  for (const file of files) {
    const content = fs.readFileSync(path.join(siteAvailablePath, file), 'utf-8');
    siteAvailables.push({
      name: file,
      content,
    });
  }
  return siteAvailables;
}

const protectTraversing = (basePath: string, wantedPath: string) => {
  const p = path.resolve(path.join(basePath, wantedPath));
  if (!p.includes(basePath)) {
    throw new Error('Error trying to write ouside of autorized directory.');
  }
  return p;
}

export const writeSiteAvailable = (filename: string, content: string) => {
  const p = protectTraversing(siteAvailablePath, filename);
  fs.writeFileSync(p, content);
}

export const readSiteAvailable = (filename: string) => {
  const p = protectTraversing(siteAvailablePath, filename);
  return fs.readFileSync(p, 'utf-8');
}

export const siteAvailableExists = (filename: string) => {
  const p = protectTraversing(siteAvailablePath, filename);
  return fs.existsSync(p);
}

export const siteEnabledExists = (filename: string) => {
  const p = protectTraversing(siteEnabledPath, filename);
  const r = fs.existsSync(p);
  return r;
}

export const startService = () => {
  return execa('sudo', ['service', 'nginx', 'start'], {
    cwd: __dirname,
  });
}

export const restartService = () => {
  return execa('sudo', ['service', 'nginx', 'restart'], {
    cwd: __dirname,
  });
}

export const reloadService = async () => {
  return execa('sudo', ['service', 'nginx', 'reload'], {
    cwd: __dirname,
  });
}

export const testConfig = async () => {
  const res = await execa('sudo', ['nginx', '-t'], {
    cwd: __dirname,
  });
  return res.stderr;
}

export const deployConfig = (filename: string) => {
  const siteEnabled = protectTraversing(siteEnabledPath, filename);
  const siteAvailable = protectTraversing(siteAvailablePath, filename);
  return execa('ln', ['-s', siteAvailable, siteEnabled], {
    cwd: __dirname,
  });
}

export const readStreamErrorLog = () => {
  return fs.createReadStream(errorLogPath);
}

export const convertLogLine = (line: string): NginxAccessLog => {
  const data = JSON.parse(line);
  return {
    ...data,
    date_gmt: new Date(data.date_gmt),
    status: +data.status || 0,
    request_time: +data.request_time || 0,
    content_length: +data.content_length || 0,
    body_bytes_sent: +data.body_bytes_sent || 0,
  }
}

export const deleteSite = (filename: string): Promise<void> => {
  const available = protectTraversing(siteAvailablePath, filename);
  const enabled = protectTraversing(siteEnabledPath, filename);
  return new Promise((resolve, reject) => {
    try {
      if (fs.existsSync(enabled)) {
        fs.rmSync(enabled);
      }
      if (fs.existsSync(available)) {
        fs.rmSync(available);
      }
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

export const watchAccessLog = (callback = (err: Error | null, s?: NginxAccessLog) => { }) => {
  fs.watch(accessLogPath, async (event, filename) => {
    console.log(event, filename);
    if (event === 'change') {
      try {
        const lastLine = await execa('tail', ['-n', '1', accessLogPath]);
        const nginxAccessLog = convertLogLine(lastLine.stdout);
        console.log(nginxAccessLog);
        callback(null, nginxAccessLog);
      } catch (e: any) {
        callback(e);
      }
    }
  });
}
