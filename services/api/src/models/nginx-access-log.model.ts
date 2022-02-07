import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class NginxAccessLog extends Entity {
  // Define well-known properties here
  @property({
    type: 'string',
    id: true,
    generated: true,
    mongodb: {dataType: 'ObjectID'},
  })
  id: string;

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<NginxAccessLog>) {
    super(data);
  }
}

export interface NginxAccessLogRelations {
  // describe navigational properties here
}

export type NginxAccessLogWithRelations = NginxAccessLog & NginxAccessLogRelations;
