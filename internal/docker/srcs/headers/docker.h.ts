import type {
  ModelCluster,
  ModelContainer
} from '@nxtranet/headers';
import type Dockerode from 'dockerode';

export declare namespace EventContainersStats {
  export type payload = {
    Id: string;
  };
  export type response = Dockerode.ContainerStats;
}

export declare namespace EventClustersDeploy {
  export type payload = {
    cluster: ModelCluster;
    commitSHA: string;
    branch: string;
  }
  export type response = Partial<ModelContainer>;
}

export declare namespace EventContainersCreate {
  export type payload = Dockerode.ContainerCreateOptions;
  export type response = Dockerode.ContainerInspectInfo;
}

export declare namespace EventContainersAttach {
  export type payload = ModelContainer;
  export type response = void;
}

export declare namespace EventContainersInfo {
  export type payload = void;
  export type response = Dockerode.ContainerInspectInfo[];
}

export declare namespace EventContainersStart {
  export type payload = ModelContainer;
  export type response = void;
}

export declare namespace EventContainersStop {
  export type payload = ModelContainer;
  export type response = void;
}

export declare namespace EventContainersRemove {
  export type payload = {
    Id: string;
  };
  export type response = void;
}


export type ContainerStats = {
  id: string;
  name: string;
} & Dockerode.ContainerStats;
