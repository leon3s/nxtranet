import {repository} from '@loopback/repository';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {ContainerRepository} from '../repositories';

export
  class SubdomainService {

  protected configFilePath = path.join(os.homedir(), '.nextranet_subdomain');

  constructor(
    @repository(ContainerRepository)
    protected containerRepository: ContainerRepository,
  ) {
  }

  writeConfig = async () => {
    const containers = await this.containerRepository.find();
    const data = containers.reduce((acc: Record<string, number>, container) => {
      acc[container.namespace.toLowerCase()] = container.appPort;
      return acc;
    }, {});
    fs.writeFileSync(this.configFilePath, JSON.stringify(data, null, 2));
  }
}
