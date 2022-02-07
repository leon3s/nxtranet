function extractHost(s) {
  const hostReg = /host\ *(.*);/;
  const ret = s.match(hostReg);
  if (!ret) throw new Error('Error host not found in nxtranet block.');
  return ret[1];
}

function extractDomain(s) {
  const domainReg = /domain\ *(.*);/;
  const ret = s.match(domainReg);
  if (!ret) throw new Error('Error domain not found in nxtranet block.');
  return ret[1];
}

function extractNextranetBlock(sConfig) {
  const nxtranetBlockReg = /(nxtranet\ *){(\ *.*?)}/s;
  const ret = sConfig.match(nxtranetBlockReg);
  if (!ret) throw new Error('Error nxtranet block not found');
  return ret[2];
}

function parseNxtranetBlock(sConfig) {
  const nxtranetBlock = extractNextranetBlock(sConfig);
  const host = extractHost(nxtranetBlock);
  const domain = extractDomain(nxtranetBlock);
  return {
    host,
    domain,
  }
}

function extractDockerBlock(sConfig) {
  const dockerBlockReg = /(docker\ *){(\ *.*?)}/s;
  const ret = sConfig.match(dockerBlockReg);
  if (!ret) throw new Error('Error nxtranet block not found');
  return ret[2];
}

function parseDockerBlock(sConfig) {
  const dockerBlock = extractDockerBlock(sConfig);
  const host = extractHost(dockerBlock);
  return {
    host,
  }
}

export default function parseConfig(sConfig) {
  const nxtranet = parseNxtranetBlock(sConfig);
  const docker = parseDockerBlock(sConfig);
  return {
    nxtranet,
    docker,
  }
}
