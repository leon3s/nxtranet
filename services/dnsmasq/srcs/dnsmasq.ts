import execa from 'execa';
import fs from 'fs';

export const start = () => {
  return execa('sudo', ['service', 'dnsmasq', 'start'], {
    cwd: __dirname,
  });
}

export const restart = () => {
  return execa('sudo', ['service', 'dnsmasq', 'restart'], {
    cwd: __dirname,
  });
}

export const syncConfig = (data: string) => {
  return new Promise<void>((resolve, reject) => {
    fs.writeFile('/etc/dnsmasq.d/nextranet.domains', data, (err) => {
      if (err) return reject(err);
      return resolve();
    });
  });
}

export const readConfig = () => {
  return new Promise<string>((resolve, reject) => {
    fs.readFile('/etc/dnsmasq.d/nextranet.domains', (err, buffer) => {
      if (err) return reject(err);
      resolve(buffer.toString());
    });
  });
}
