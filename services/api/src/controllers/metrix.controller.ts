import {repository} from '@loopback/repository';
import {get} from '@loopback/rest';
import {NginxAccessLogRepository} from '../repositories';

export class MetrixController {
  constructor(
    @repository(NginxAccessLogRepository)
    protected nginxAccessLogRepository: NginxAccessLogRepository,
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
    const nginxAccessLogCollection = (this.nginxAccessLogRepository.dataSource.connector as any).collection("NginxAccessLog");
    const res = await nginxAccessLogCollection
      .aggregate([{
        $group: {
          _id: "$host",
          count: {$sum: 1}
        }
      }]).get();
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
}
