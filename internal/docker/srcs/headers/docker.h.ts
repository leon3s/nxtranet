import type {
  ModelCluster,
  ModelContainer
} from '@nxtranet/headers';
import type Dockerode from 'dockerode';

export declare namespace EventClustersDeploy {
  export type payload = {
    cluster: ModelCluster;
    branch: string;
  }
  export type response = Partial<ModelContainer>;
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
  export type payload = ModelContainer;
  export type response = void;
}
