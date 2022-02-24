import {repository} from '@loopback/repository';
import {get} from '@loopback/rest';
import {ClusterProductionRepository, ContainerRepository, NginxAccessLogRepository} from '../repositories';

export class MetrixController {
  constructor(
    @repository(NginxAccessLogRepository)
    protected nginxAccessLogRepository: NginxAccessLogRepository,
    @repository(ContainerRepository)
    protected containerRepository: ContainerRepository,
    @repository(ClusterProductionRepository)
    protected clusterProductionRepository: ClusterProductionRepository,
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
    const nginxAccessLogCollection = (this.nginxAccessLogRepository.dataSource.connector as any).collection("NginxAccessLog");
    const [{request_time}] = await nginxAccessLogCollection
      .aggregate({
        $group: {
          _id: '',
          request_time: {$sum: '$request_time'}
        }
      }, {
        $project: {
          _id: 0,
          request_time: '$request_time'
        }
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
    const clusterProds = await this.clusterProductionRepository.find();
    const domains = clusterProds.map(({domain}) => domain);
    const nginxAccessLogCollection = (this.nginxAccessLogRepository.dataSource.connector as any).collection("NginxAccessLog");
    const res = await nginxAccessLogCollection
      .aggregate()
      .match({host: {$in: domains}})
      .group({
        _id: "$host",
        count: {$sum: 1}
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
    const nginxAccessLogCollection = (this.nginxAccessLogRepository.dataSource.connector as any).collection("NginxAccessLog");
    const res = await nginxAccessLogCollection
      .aggregate([{
        $group: {
          _id: "$status",
          count: {$sum: 1}
        }
      }]).get();
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
    const {count} = await this.nginxAccessLogRepository.count();
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
    const {count} = await this.clusterProductionRepository.count();
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
}
