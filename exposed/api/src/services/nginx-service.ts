import type {NginxAccessLog, NginxSiteAvailable} from '@nxtranet/headers';
import fs from 'fs';
import mustache from 'mustache';
import path from 'path';
import {client} from '../../../../internal/nginx';

export type NginxProdConfig = {
  domain: string;
  ports: number[];
  host: string;
  projectName: string;
  clusterName: string;
}

type NginxDevConfig = {
  domain: string;
  port: number;
  host: string;
}

const templateProdPath = path.join(
  __dirname,
  '../../../../config/nginx/template.production.conf',
);

const templateDevPath = path.join(
  __dirname,
  '../../../../config/nginx/template.single.conf',
)

export
  class NginxService {
  _client: typeof client = client;

  constructor(
  ) { }

  disconnect = () => {
    this._client.disconnect();
  }

  connect = () => {
    this._client.connect();
  }

  formatCacheName(name: string) {
    return `cache_${name}`;
  }

  formatUpstreamName(name: string) {
    return `upstream_${name}`;
  }

  formatName(projectName: string, clusterName: string) {
    return `${projectName}_${clusterName}`;
  }

  generateUpstream(upstream: string, ports: number[]) {
    return `
upstream ${upstream} {
\tip_hash;
\t${ports.reduce((acc, port, i) => {
      return acc += `server 127.0.0.1:${port};${i === ports.length - 1 ? '' : '\n\t'}`;
    }, '')}
}`
  }

  updateProdConfig = async (config: NginxProdConfig, oldConfig?: NginxProdConfig) => {
    const {
      projectName,
      clusterName,
      ports,
    } = config;
    const name = this.formatName(projectName, clusterName);
    const oldCacheName = this.formatCacheName(name);
    const oldUpstreamName = this.formatUpstreamName(name);
    const newCacheName = this.formatCacheName(name);
    const newUpstreamName = this.formatUpstreamName(name);
    let file = await this.readSiteAvailable(this.formatName(projectName, clusterName));
    const cacheReg = new RegExp(oldCacheName, 'gi');
    file = file.replace(cacheReg, newCacheName);
    const upstreamReg = new RegExp(oldUpstreamName, 'gi');
    file = file.replace(upstreamReg, newUpstreamName);
    const newUpstreamBlock = this.generateUpstream(newUpstreamName, ports);
    file = file.replace(/upstream .*{[^\\n]+}/gm, newUpstreamBlock);
    await this.writeSiteAvailable(this.formatName(projectName, clusterName), file);
  }

  writeDevConfig = async (filename: string, config: NginxDevConfig) => {
    const d = fs.readFileSync(templateDevPath, 'utf-8');
    const render = mustache.render(d, config);
    await this.writeSiteAvailable(filename, render);
  }

  createProdConfig = async (config: NginxProdConfig) => {
    const {
      ports,
      domain,
      host,
      projectName,
      clusterName,
    } = config;
    const d = fs.readFileSync(templateProdPath, 'utf-8');
    const name = this.formatName(projectName, clusterName);
    const render = mustache.render(d, {
      ports,
      domain,
      host,
      upstream: this.formatUpstreamName(name),
      cache_name: this.formatCacheName(name),
    });
    await this.writeSiteAvailable(this.formatName(projectName, clusterName), render);
  }

  getSitesAvailable = (): Promise<NginxSiteAvailable[]> => {
    return this._client.sitesAvailable();
  }

  writeSiteAvailable = (filename: string, content: string): Promise<void> => {
    return this._client.sitesAvailableWrite({
      filename,
      content
    });
  }

  readSiteAvailable = (filename: string): Promise<string> => {
    return this._client.sitesAvailableRead({
      filename
    });
  }

  siteAvailableExists = (filename: string): Promise<boolean> => {
    return this._client.sitesAvailableExists({
      filename,
    });
  }

  siteEnabledExists = (filename: string): Promise<boolean> => {
    return this._client.sitesEnableExists({
      filename,
    });
  }

  deploySiteAvailable = (filename: string): Promise<void> => {
    return this._client.sitesAvailableDeploy({
      filename,
    });
  }

  monitorAccessLog = (callback: (err: Error | null, log: NginxAccessLog) => {}) => {
    this._client.watchAccessLog(callback);
    this._client.monitorAccessLog();
  }

  testConfig = (): Promise<string> => {
    return this._client.test();
  }

  clearSite = async (filename: string): Promise<void> => {
    return this._client.sitesDelete({
      filename,
    });
  }

  reloadService = (): Promise<void> => {
    return this._client.reload();
  }
}
