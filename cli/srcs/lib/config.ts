import execa from 'execa';
import fs from 'fs';
import mustache from 'mustache';
import path from 'path';
import type {NxtUserConfig} from '../headers/nxtranetdev.h';
import {
  dnsmasqDefault, nginxDefault, nxtranetNginx
} from './nxtconfig';
import getUserConfig from './nxtUserconfig';

function generateNginxNxtranet(nxtUserconf: NxtUserConfig) {
  const template = fs.readFileSync(nxtranetNginx, 'utf-8');
  const render = mustache.render(template, nxtUserconf);
  fs.writeFileSync('/etc/nginx/sites-available/nxtranet', render);
}

function generateDnsmasqConf(nxtUserconf: NxtUserConfig) {
  const template = fs.readFileSync(dnsmasqDefault, 'utf-8');
  const render = mustache.render(template, nxtUserconf);
  fs.writeFileSync('/etc/dnsmasq.conf', render);
}

async function configureDnsmasq(nxtUserconf: NxtUserConfig) {
  generateDnsmasqConf(nxtUserconf);
}

async function configureNginx(nxtUserconf: NxtUserConfig) {
  await execa('cp', [nginxDefault, '/etc/nginx/nginx.conf']);
  generateNginxNxtranet(nxtUserconf);
  if (!fs.existsSync(path.join('/etc/nginx/sites-enabled', 'nxtranet'))) {
    await execa('ln', ['-s', '/etc/nginx/sites-available/nxtranet', '/etc/nginx/sites-enabled']);
  }
}

export async function generateConfigFiles() {
  const nxtUserconf = getUserConfig();
  await configureNginx(nxtUserconf);
  await configureDnsmasq(nxtUserconf);
}
