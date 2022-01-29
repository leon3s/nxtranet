export type Pkgjson = {
  name: string;
  scripts: {
    dev: string;
    start: string;
  }
}

export type ServiceConfig = {
  name: string;
  path: string;
  user: string;
  pkg: Pkgjson;
}

export type NxtdevConfig = {
  name: string;
  _path: string;
  servicesDirectories: string[];
  packagesDirectories: string[];
}

export type NxthatPJ = {
  user?: string;
  skipDevBuild?: boolean;
  watchDirectories?: string[];
}

export type Project = {
  _path: string;
  pkg: Pkgjson | null;
  settings: NxthatPJ | null;
}
