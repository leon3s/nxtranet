import fs from 'fs';
import path from 'path';
import {NxtUserConfig} from 'srcs/headers/nxtranetdev.h';

export const nxtranetUserConfDir = '/etc/nxtranet';
export const nxtranetUserConfFile = path.join(nxtranetUserConfDir, 'nxtranet.conf');

function extractHost(s: string) {
  const hostReg = /host\ *(.*);/;
  const ret = s.match(hostReg);
  if (!ret) throw new Error('Error host not found in nxtranet block.');
  return ret[1];
}

function extractDomain(sConfig: string) {
  const domainReg = /domain\ *(.*);/;
  const ret = sConfig.match(domainReg);
  if (!ret) throw new Error('Error domain not found in nxtranet block.');
  return ret[1];
}

function extractPublicHost(sConfig: string) {
  const publicHostReg = /public_host\ *(.*);/;
  const ret = sConfig.match(publicHostReg);
  if (!ret) throw new Error('Error public host not found in nxtranet block.');
  return ret[1];
}

function extractNextranetBlock(sConfig: string) {
  const nxtranetBlockReg = /(nxtranet\ *){(\ *.*?)}/s;
  const ret = sConfig.match(nxtranetBlockReg);
  if (!ret) throw new Error('Error nxtranet block not found');
  return ret[2];
}

function parseNxtranetBlock(sConfig: string) {
  const nxtranetBlock = extractNextranetBlock(sConfig);
  const host = extractHost(nxtranetBlock);
  const domain = extractDomain(nxtranetBlock);
  const public_host = extractPublicHost(nxtranetBlock);
  return {
    host,
    domain,
    public_host,
  }
}

function extractDockerBlock(sConfig: string) {
  const dockerBlockReg = /(docker\ *){(\ *.*?)}/s;
  const ret = sConfig.match(dockerBlockReg);
  if (!ret) throw new Error('Error nxtranet block not found');
  return ret[2];
}

function parseDockerBlock(sConfig: string) {
  const dockerBlock = extractDockerBlock(sConfig);
  const host = extractHost(dockerBlock);
  return {
    host,
  }
}

function parseConfig(sConfig: string): NxtUserConfig {
  const nxtranet = parseNxtranetBlock(sConfig);
  const docker = parseDockerBlock(sConfig);
  return {
    nxtranet,
    docker,
  }
}

export function userConfigToEnv(userConfig: NxtUserConfig) {
  return [
    `NODE_ENV=${process.env.NODE_ENV || 'development'}`,
    `NXTRANET_HOST=${userConfig.nxtranet.host}`,
    `NXTRANET_DOMAIN=${userConfig.nxtranet.domain}`,
    `NXTRANET_DOCKER_HOST=${userConfig.docker.host}`,
    `NXTRANET_PUBLIC_HOST=${userConfig.nxtranet.public_host}`,
  ];
}

export default function getUserConfig(): NxtUserConfig {
  const sConfig = fs.readFileSync(nxtranetUserConfFile, 'utf-8');
  return parseConfig(sConfig);
}
