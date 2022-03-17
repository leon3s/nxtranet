import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, HttpErrors, param} from '@loopback/rest';
import {ModelClusterType} from '@nxtranet/headers';
import {MetrixServiceBindings} from '../keys';
import {
  ClusterRepository,
  ContainerRepository,
  NginxAccessLogRepository
} from '../repositories';
import MetrixService from '../services/metrix-service';

export class MetrixController {
  constructor(
    @repository(NginxAccessLogRepository)
    protected nginxAccessLogRepository: NginxAccessLogRepository,
    @repository(ContainerRepository)
    protected containerRepository: ContainerRepository,
    @repository(ClusterRepository)
    protected clusterRepository: ClusterRepository,
    @inject(MetrixServiceBindings.METRIX_SERVICE)
    protected metrixService: MetrixService
  ) { }

  @get('/metrix/nginx/art', {
    responses: {
      '200': {
        description: 'Nginx average response time',
        content: {
          'text/plain': {
            schema: {
              type: "number",
              example: 1.5,
            }
          }
        },
      },
    },
  })
  async nginxAverageResponseTime() {
    const clusters = await this.clusterRepository.find({
      where: {
        type: {
          nin: [ModelClusterType.TESTING],
        }
      }
    });
    const hostnames = clusters.map(({hostname}) => hostname);
    const nginxAccessLogCollection = (this.nginxAccessLogRepository.dataSource.connector as any).collection("NginxAccessLog");
    if (!hostnames.length) return 0;
    return this.metrixService.getArtForHostnames(hostnames);
  }

  @get('/metrix/nginx/domains', {
    responses: {
      '200': {
        description: 'Nginx average-response-time',
        content: {
          'text/plain': {
            schema: {
              type: "number",
              example: 1.5,
            }
          }
        },
      },
    },
  })
  async nginxDomains() {
    const clusters = await this.clusterRepository.find({
      where: {
        type: {
          nin: [ModelClusterType.TESTING],
        }
      }
    });
    const hostnames = clusters.map(({hostname}) => hostname);
    const nginxAccessLogCollection = (this.nginxAccessLogRepository.dataSource.connector as any).collection("NginxAccessLog");
    const res = await nginxAccessLogCollection
      .aggregate()
      .match({host: {$in: hostnames}})
      .group({
        _id: "$host",
        count: {$sum: 1}
      })
      .sort({
        count: -1,
      })
      .get();
    return res;
  }

  @get('/metrix/nginx/status', {
    responses: {
      '200': {
        description: 'Get nginx request status',
        content: {
          'text/plain': {
            schema: {
              type: "number",
              example: 1.5,
            }
          }
        },
      },
    },
  })
  async nginxStatus() {
    const clusters = await this.clusterRepository.find({
      where: {
        type: {
          nin: [ModelClusterType.TESTING],
        }
      }
    });
    const hostnames = clusters.map(({hostname}) => hostname);
    const nginxAccessLogCollection = (this.nginxAccessLogRepository.dataSource.connector as any).collection("NginxAccessLog");
    const res = await nginxAccessLogCollection
      .aggregate()
      .match({
        status: {$exists: true},
        host: {$in: hostnames}
      })
      .group({
        _id: "$status",
        count: {$sum: 1}
      })
      .sort({
        count: -1,
      })
      .get();
    return res;
  }

  @get('/metrix/nginx/req/count', {
    responses: {
      '200': {
        description: 'Nginx average-response-time',
        content: {
          'text/plain': {
            schema: {
              type: "number",
              example: 800,
            }
          }
        },
      },
    },
  })
  async nginxReqCount() {
    const clusters = await this.clusterRepository.find({
      where: {
        type: {
          nin: [ModelClusterType.TESTING],
        }
      }
    });
    const hostnames = clusters.map(({hostname}) => hostname);
    const {count} = await this.nginxAccessLogRepository.count({
      host: {
        in: hostnames,
      }
    });
    return count;
  }

  @get('/metrix/nginx/domains/{name}/path', {
    responses: {
      '200': {
        description: 'Nginx average-response-time',
        content: {
          'text/plain': {
            schema: {
              type: "number",
              example: 1.5,
            }
          }
        },
      },
    },
  })
  async domainNamePath(
    @param.path.string('name') name: string,
  ) {
    const nginxAccessLogCollection = (this.nginxAccessLogRepository.dataSource.connector as any).collection("NginxAccessLog");
    const res = await nginxAccessLogCollection
      .aggregate()
      .match({
        host: name,
      })
      .group({
        _id: "$uri",
        count: {$sum: 1}
      })
      .get();
    return res.sort((a: any, b: any) => b.count - a.count);
  }

  @get('/metrix/nginx/domains/{name}/art', {
    responses: {
      '200': {
        description: 'Nginx average-response-time',
        content: {
          'text/plain': {
            schema: {
              type: "number",
              example: 1.5,
            }
          }
        },
      },
    },
  })
  async domainNameArt(
    @param.path.string('name') name: string,
  ) {
    return this.metrixService.getArtForHostname(name);
  }

  @get('/metrix/nginx/domains/{name}/req-count', {
    responses: {
      '200': {
        description: 'Nginx average-response-time',
        content: {
          'text/plain': {
            schema: {
              type: "number",
              example: 1.5,
            }
          }
        },
      },
    },
  })
  async domainNameReqCount(
    @param.path.string('name') name: string,
  ) {
    const {count: total} = await this.nginxAccessLogRepository.count({
      host: name
    });
    return total;
  }

  @get('/metrix/nginx/domains/{name}/status', {
    responses: {
      '200': {
        description: 'Nginx average-response-time',
        content: {
          'text/plain': {
            schema: {
              type: "number",
              example: 1.5,
            }
          }
        },
      },
    },
  })
  async domainNameStatus(
    @param.path.string('name') name: string,
  ) {
    const nginxAccessLogCollection = (this.nginxAccessLogRepository.dataSource.connector as any).collection("NginxAccessLog");
    const res = await nginxAccessLogCollection
      .aggregate()
      .match({
        host: name,
      })
      .group({
        _id: "$status",
        count: {$sum: 1}
      })
      .get();
    return res;
  }

  @get('/metrix/containers/{name}', {
    responses: {
      '200': {
        description: 'Metrix of container for his given name',
      }
    }
  })
  async getContainerMetrixByName(
    @param.path.string('name') name: string,
  ) {
    const container = await this.containerRepository.findOne({
      where: {
        name,
      }
    });
    if (!container) {
      throw new HttpErrors.NotFound(`Container ${name} not found.`);
    }
    const proxy_host = `127.0.0.1:${container.appPort}`;
    const containerStat = await this.containerRepository
      .stat(container.dockerID).get();

    const art = await this.metrixService.getArtForProxyHost(proxy_host);
    const {count} = await this.nginxAccessLogRepository.count({
      or: [{
        proxy_host,
      }, {
        upstream_addr: proxy_host,
      }]
    });
    const rsc = await this.metrixService.getRscForProxyHost(proxy_host);
    return {
      art,
      rsc,
      reqCount: count,
      stat: containerStat,
    }
  }
}
