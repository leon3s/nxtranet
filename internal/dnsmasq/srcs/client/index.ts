import {Client} from '@nxtranet/service';
import {
  EventConfigRead,
  EventConfigSync,
  EventRestart
} from '../headers/dnsmasq.h';
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

export function disconnect() {
  client.socket.disconnect();
}

export function configSync(
  payload: EventConfigSync.payload
): Promise<EventConfigSync.response> {
  return client.send<
    EventConfigSync.payload,
    EventConfigSync.response
  >(Events.configSync, payload);
}

export function configRead(
  payload: EventConfigRead.payload,
): Promise<EventConfigRead.response> {
  return client.send<
    EventConfigRead.payload,
    EventConfigRead.response
  >(Events.configRead, payload);
}

export function restart(
  payload: EventRestart.payload,
): Promise<EventRestart.response> {
  return client.send<
    EventRestart.payload,
    EventRestart.response
  >(Events.restart, payload);
}
