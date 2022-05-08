import {ModelContainer} from '@nxtranet/headers';
import {Client} from '@nxtranet/service';
import type {
  ContainerStats,
  EventClustersDeploy,
  EventContainersAttach,
  EventContainersCreate,
  EventContainersInfo,
  EventContainersRemove,
  EventContainersStart,
  EventContainersStats,
  EventContainersStop
} from '../headers/docker.h';
import {
  host,
  port
} from '../shared/config';
import Events from '../shared/events';

let client: Client | null = null;

export function connect() {
  client = new Client(`http://${host}:${port}`);
  return client;
}

export function waitConnection() {
  return new Promise<void>((resolve) => {
    client.socket.on('connect', () => {
      resolve();
    });
  });
}

export function getSocket(): typeof client.socket {
  return client.socket;
}

export function disconnect() {
  client.socket.disconnect();
}

export function clustersDeploy(
  payload: EventClustersDeploy.payload
): Promise<EventClustersDeploy.response> {
  return client.send<
    EventClustersDeploy.payload,
    EventClustersDeploy.response
  >(Events.clustersDeploy, payload);
}

export function containersAttach(
  payload: EventContainersAttach.payload,
): Promise<EventContainersAttach.response> {
  return client.send<
    EventContainersAttach.payload,
    EventContainersAttach.response
  >(Events.containersAttach, payload);
}

export function containersInfo(
  payload: EventContainersInfo.payload,
): Promise<EventContainersInfo.response> {
  return client.send<
    EventContainersInfo.payload,
    EventContainersInfo.response
  >(Events.containersInfo, payload);
}

export function containersStart(
  payload: EventContainersStart.payload
): Promise<EventContainersStart.response> {
  return client.send<
    EventContainersStart.payload,
    EventContainersStart.response
  >(Events.containersStart, payload);
}

export function containersStop(
  payload: EventContainersStop.payload,
): Promise<EventContainersStop.response> {
  return client.send<
    EventContainersStop.payload,
    EventContainersStop.response
  >(Events.containersStop, payload);
}

export function containersRemove(
  payload: EventContainersRemove.payload,
): Promise<EventContainersRemove.response> {
  return client.send<
    EventContainersRemove.payload,
    EventContainersRemove.response
  >(Events.containersRemove, payload);
}

export function containersCreate(
  payload: EventContainersCreate.payload,
): Promise<EventContainersCreate.response> {
  return client.send<
    EventContainersCreate.payload,
    EventContainersCreate.response
  >(Events.containersCreate, payload);
}

export function containersStats(
  payload: EventContainersStats.payload,
): Promise<EventContainersStats.response> {
  return client.send<
    EventContainersStats.payload,
    EventContainersStats.response
  >(Events.containersStats, payload);
}

export function watchContainersStatus(
  payload: ModelContainer,
  callback: (event: {type: string, payload: any}) => void,
): void {
  client.socket.on(payload.namespace, callback);
}

export function watchContainerStat(
  payload: ModelContainer,
  callback: (stat: ContainerStats) => void,
): void {
  client.socket.on(`stat_${payload.dockerID}`, callback);
}
