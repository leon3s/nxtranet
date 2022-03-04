import {inject} from '@loopback/core';
import {
  get,
  Request,
  response,
  ResponseObject,
  RestBindings
} from '@loopback/rest';

const PING_RESPONSE: ResponseObject = {
  description: 'Ping Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PingResponse',
        properties: {
          greeting: {type: 'string'},
          date: {type: 'string'},
          url: {type: 'string'},
          headers: {
            type: 'object',
            properties: {
              'Content-Type': {type: 'string'},
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

export class PingController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) { }

  @get('/ping')
  @response(200, PING_RESPONSE)
  ping(): object {
    return {
      uptime: process.uptime(),
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }
}
