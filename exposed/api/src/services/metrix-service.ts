import {repository} from '@loopback/repository';
import {NginxAccessLogRepository} from '../repositories';

export default class MetrixService {
  nginxAccessLogCollection: any;

  constructor(
    @repository(NginxAccessLogRepository)
    protected nginxAccessLogRepository: NginxAccessLogRepository
  ) {
    this.nginxAccessLogCollection = (this.nginxAccessLogRepository.dataSource.connector as any).collection("NginxAccessLog");
  }

  // Get average response time for given proxyHost (127.0.0.1:XXXX)
  getArtForProxyHost = async (proxy_host: string) => {
    const [item] = await this.nginxAccessLogCollection
      .aggregate()
      .match({
        $or: [{proxy_host}, {upstream_addr: proxy_host}],
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
      or: [{proxy_host}, {upstream_addr: proxy_host}],
    });
    if (!item) return 0;
    return Number((item.request_time / total).toFixed(3));
  }

  // Get average response time for given hostnames
  getArtForHostnames = async (hostnames: string[]): Promise<number> => {
    const [item] = await this.nginxAccessLogCollection
      .aggregate()
      .match({
        host: {$in: hostnames},
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
      host: {
        in: hostnames
      }
    });
    if (!item) return 0;
    return Number((item.request_time / total).toFixed(3));
  }

  // Get average response time for given hostname
  getArtForHostname = async (hostname: string): Promise<number> => {
    const [item] = await this.nginxAccessLogCollection
      .aggregate()
      .match({
        host: hostname,
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
      host: hostname
    });
    if (!item) return 0;
    return Number((item.request_time / total).toFixed(3));
  }

  // Get number of different http status code delivered by the proxyhost
  getRscForProxyHost = (proxy_host: string) => {
    return this.nginxAccessLogCollection
      .aggregate()
      .match({
        status: {$exists: true},
        $or: [{proxy_host}, {upstream_addr: proxy_host}],
      })
      .group({
        _id: "$status",
        count: {$sum: 1}
      })
      .sort({
        count: -1,
      })
      .get();
  }
}
