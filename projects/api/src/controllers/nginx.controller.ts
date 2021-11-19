import {inject} from '@loopback/core';
import { get, param, post, requestBody, response } from '@loopback/rest';
import {NginxServiceBindings} from '../keys';
import {NginxService} from '../services/nginx-service';
import type { NginxSiteAvaible } from '@nxtranet/headers';

export class NginxController {
  constructor(
    @inject(NginxServiceBindings.NGINX_SERVICE)
    protected nginxService: NginxService,
  ) { }

  @get('/nginx/restart', {
    responses: {
      '200': {
        description: 'Restart nginx service',
        content: {
          'text/plain': {
            schema: {
              type: "string",
              example: "Ok",
            }
          }
        },
      },
    },
  })
  async restartService(): Promise<string> {
    await this.nginxService.restartService();
    return "Ok";
  }

  @get('/nginx/test', {
    responses: {
      '200': {
        content: {
          'text/plain': {
            schema: {
              type: 'string',
              exemple: 'Ok',
            }
          }
        }
      }
    }
  })
  async testConfig() {
    const result = await this.nginxService.testConfig();
    console.log(result);
    return `${result.stdout}${result.stderr}`;
  }

  @get('/nginx/sites-avaible', {
    responses: {
      '200': {
        description: 'Get list of nginx sites avaible',
        content: {
          'application/json': {
            schema: {
              type: 'array', items: {
                properties: {
                  name: {
                    type: "string"
                  },
                  content: {
                    type: "string"
                  }
                }
              }
            },
          },
        },
      },
    },
  })
  async getSiteAvaible(): Promise<NginxSiteAvaible[]> {
    return this.nginxService.getSitesAvaible();
  }

  @post('/nginx/sites-avaible/{filename}/write')
  @response(200, {
    description: 'Write fileconf into nginx sites avaible folder',
    content: {
      'text/plain': {
        schema: {
          type: "string",
          example: "Ok",
        }
      }
    },
  })
  async writeFile(
    @param.path.string('filename') filename: string,
    @requestBody({
      content: {
        'text/plain': {
          schema: {
            type: "string",
            example: "http {\n}",
          }
        },
      },
    })
    content: string,
  ): Promise<string> {
    console.log({
      filename,
      content,
    })
    await this.nginxService.writeSiteAvaible(filename, content);
    return "Ok";
  }
}
