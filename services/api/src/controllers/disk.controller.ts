import {inject} from '@loopback/core';
import {get} from '@loopback/rest';
import type {ModelDisk} from '@nxtranet/headers';
import {SystemServiceBindings} from '../keys';
import {SystemService} from '../services/system-service';

export class DiskController {
  constructor(
    @inject(SystemServiceBindings.SYSTEM_SERVICE)
    protected systemService: SystemService,
  ) { }

  @get('/disk/info', {
    responses: {
      '200': {
        description: 'Get disk available information',
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
  async getSiteAvaible(): Promise<ModelDisk[]> {
    return this.systemService.getDiskInfo();
  }
}
