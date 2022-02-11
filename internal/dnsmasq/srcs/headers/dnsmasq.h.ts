export declare namespace EventConfigSync {
  export type payload = {
    filecontent: string;
  }
  export type response = void;
}

export declare namespace EventConfigRead {
  export type payload = void;
  export type response = string;
}

export declare namespace EventRestart {
  export type payload = void;
  export type response = void;
}
