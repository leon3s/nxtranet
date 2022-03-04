import {repository} from '@loopback/repository';
import {get, param} from '@loopback/rest';
import {ModelClusterType} from '@nxtranet/headers';
import {ClusterRepository, ContainerRepository, NginxAccessLogRepository} from '../repositories';

export class MetrixController {
  constructor(
    @repository(NginxAccessLogRepository)
    protected nginxAccessLogRepository: NginxAccessLogRepository,
    @repository(ContainerRepository)
    protected containerRepository: ContainerRepository,
    @repository(ClusterRepository)
    protected clusterRepository: ClusterRepository,
  ) { }

  @get('/metrix/nginx/average-response-time', {
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
    const [{request_time}] = await nginxAccessLogCollection
      .aggregate()
      .match({host: {$in: hostnames}})
      .group({
        _id: '',
        request_time: {$sum: '$request_time'}
      })
      .project({
        _id: 0,
        request_time: '$request_time'
      }).get();
    const {count: total} = await this.nginxAccessLogRepository.count();
    return (request_time / total).toFixed(3);
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

  @get('/metrix/cluster-production/count', {
    responses: {
      '200': {
        description: 'Nginx average-response-time',
        content: {
          'text/plain': {
            schema: {
              type: "number",
              example: 10,
            }
          }
        },
      },
    },
  })
  async clusterProductionCount() {
    const {count} = await this.clusterRepository.count({
      type: {
        nin: [ModelClusterType.TESTING, ModelClusterType.SINGLE],
      }
    });
    return count;
  }

  @get('/metrix/docker/containers/count', {
    responses: {
      '200': {
        description: 'Nginx average-response-time',
        content: {
          'text/plain': {
            schema: {
              type: "number",
              example: 10,
            }
          }
        },
      },
    },
  })
  async dockerContainersCount() {
    const {count} = await this.containerRepository.count();
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
    const nginxAccessLogCollection = (this.nginxAccessLogRepository.dataSource.connector as any).collection("NginxAccessLog");
    const [{request_time}] = await nginxAccessLogCollection
      .aggregate()
      .match({
        host: name
      })
      .group({
        _id: '',
        request_time: {$sum: '$request_time'}
      })
      .project({
        _id: 0,
        request_time: '$request_time'
      }).get();
    const {count: total} = await this.nginxAccessLogRepository.count({
      host: name
    });
    return (request_time / total).toFixed(3);
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
}
