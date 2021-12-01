export type NxtdevConfig = {
  name: string;
  _path: string;
  projectDirectories: string[];
}

export type Pkgjson = {
  name: string;
  scripts: {
    dev: string;
    start: string;
  }
}

export type NxthatPJ = {
  user?: string;
  watchDirectories?: string[]
}

export type Project = {
  _path: string;
  pkg: Pkgjson | null;
  settings: NxthatPJ | null;
}