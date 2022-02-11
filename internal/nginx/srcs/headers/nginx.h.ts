import type {NginxSiteAvailable} from '@nxtranet/headers';

export declare namespace EventSitesAvailable {
  export type payload = void;
  export type response = NginxSiteAvailable[];
}

export declare namespace EventSitesAvailableRead {
  export type payload = {filename: string};
  export type response = string;
}

export declare namespace EventSitesAvailableWrite {
  export type payload = {filename: string, content: string};
  export type response = void;
}

export declare namespace EventSitesAvailableExists {
  export type payload = {filename: string};
  export type response = boolean;
}

export declare namespace EventSiteAvailableDeploy {
  export type payload = {filename: string};
  export type response = void;
}

export declare namespace EventSiteEnabledExists {
  export type payload = {filename: string};
  export type response = boolean;
}

export declare namespace EventSiteDelete {
  export type payload = {filename: string};
  export type response = void;
}

export declare namespace EventTest {
  export type payload = void;
  export type response = string;
}

export declare namespace EventReload {
  export type payload = void;
  export type response = void;
}

export declare namespace EventMonitorAccessLog {
  export type payload = void;
  export type response = void;
}
