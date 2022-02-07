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

function extractDomain(s: string) {
  const domainReg = /domain\ *(.*);/;
  const ret = s.match(domainReg);
  if (!ret) throw new Error('Error domain not found in nxtranet block.');
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
  return {
    host,
    domain,
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

export default function getUserConfig(): NxtUserConfig {
  const sConfig = fs.readFileSync(nxtranetUserConfFile, 'utf-8');
  return parseConfig(sConfig);
}
