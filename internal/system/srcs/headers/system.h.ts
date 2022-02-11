import type {SystemDisk, SystemNetworkInterfaces} from '@nxtranet/headers';

export declare namespace EventOsNetworkInterfaces {
  export type payload = void;
  export type response = SystemNetworkInterfaces
}

export declare namespace EventOsUptime {
  export type payload = void;
  export type response = number;
}

export declare namespace EventDiskInfo {
  export type payload = void;
  export type response = SystemDisk[];
}
