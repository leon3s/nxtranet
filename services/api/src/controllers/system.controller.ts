import {inject} from '@loopback/core';
import {get} from '@loopback/rest';
import {SystemServiceBindings} from '../keys';
import {SystemService} from '../services/system-service';

export class SystemController {
  constructor(
    @inject(SystemServiceBindings.SYSTEM_SERVICE)
    protected systemService: SystemService,
  ) { }

  @get('/system/os/uptime', {
    responses: {
      '200': {
        description: 'Get system uptime',
        content: {
          'text/plain': {
            schema: {
              type: "number",
              example: 1255.10,
            }
          }
        },
      },
    },
  })
  async getOsUptime(): Promise<number> {
    return this.systemService.getUptime();
  }

  @get('/system/os/network/interfaces', {
    responses: {
      '200': {
        content: {
          // 'text/plain': {
          //   schema: {
          //     type: 'string',
          //     exemple: 'Ok',
          //   }
          // }
        }
      }
    }
  })
  async getNetworkInterfaces() {
    return this.systemService.getNetworkInterfaces();
  }

  @get('/system/disk/info', {
    responses: {
      '200': {
        description: 'Get list of nginx sites avaible',
        content: {
          // 'application/json': {
          //   schema: {
          //     type: 'array', items: {
          //       properties: {
          //         name: {
          //           type: "string"
          //         },
          //         content: {
          //           type: "string"
          //         }
          //       }
          //     }
          //   },
          // },
        },
      },
    },
  })
  async getDiskInfo() {
    return this.systemService.getDiskInfo();
  }
}
