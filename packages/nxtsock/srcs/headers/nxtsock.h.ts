export declare namespace NxtsocketEvent {
  export type Name = string;
  export type ResponseCallback = <T>(error: any, response?: T) => void;
  export type Callback<T> = (
    payload: {},
  ) => Promise<T>;
}
