import {Client} from '@nxtranet/service';
import type {EventDiskInfo, EventOsNetworkInterfaces, EventOsUptime} from '../headers/system.h';
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

export function disconnect() {
  client.socket.disconnect();
}

export function osNetworkInterfaces(
  payload: EventOsNetworkInterfaces.payload
): Promise<EventOsNetworkInterfaces.response> {
  return client.send<
    EventOsNetworkInterfaces.payload,
    EventOsNetworkInterfaces.response
  >(Events.osNetworkInterfaces, payload);
}

export function osUptime(
  payload: EventOsUptime.payload,
): Promise<EventOsUptime.response> {
  return client.send<
    EventOsUptime.payload,
    EventOsUptime.response
  >(Events.osUptime, payload);
}

export function diskInfo(
  payload: EventDiskInfo.payload,
): Promise<EventDiskInfo.response> {
  return client.send<
    EventDiskInfo.payload,
    EventDiskInfo.response
  >(Events.diskInfo, payload);
}
