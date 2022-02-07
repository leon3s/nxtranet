export type SystemNetworkInterface = {
  address: string;
  netmask: string;
  family: string;
  mac: string;
  internal: boolean;
  cidr: string;
};

export type SystemNetworkInterfaces = Record<string, SystemNetworkInterface[]>;
