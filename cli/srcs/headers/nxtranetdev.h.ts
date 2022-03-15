export type Pkgjson = {
  name: string;
  main: string;
  scripts: {
    dev: string;
    start: string;
  }
}

export type NxtConfig = {
  path: string;
  domain: string;
  docker_host: string;
  nxtranet_host: string;
  servicesDirectories: string[];
  packagesDirectories: string[];
}

export type NxtUserConfig = {
  nxtranet: {
    domain: string;
    host: string;
    public_host: string;
  };
  docker: {
    host: string;
  };
}

export type NxtSrvConfig = {
  user?: string;
  skipDevBuild?: boolean;
  watchDirectories?: string[];
}

export type ServiceDef = {
  path: string;
  name: string;
  user: string;
  pkg: Pkgjson;
  skipDevBuild?: boolean;
  filePermissions: string[];
}

export type PackageDef = {
  path: string;
  name: string;
  pkg: Pkgjson;
}

export type NxtGlobalConfig = {
  services: ServiceDef[];
  packages: PackageDef[];
} & NxtConfig;
