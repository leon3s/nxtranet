import {NextranetApi} from '../application';
import {PortMappingRepository, PortRepository, ServiceRepository} from '../repositories';

const nativeServices = [
  {
    name: 'proxies',
    port: 7898,
    ports: [
      5454,
    ],
  },
  {
    name: 'docker',
    port: 1243,
    ports: [],
  },
  {
    name: 'nginx',
    port: 3211,
    ports: [
      80,
      8080,
    ],
  }
]

const main = async () => {
  const app = new NextranetApi();
  await app.boot();
  const serviceRepository = await app.getRepository(ServiceRepository);
  const portRepository = await app.getRepository(PortRepository);
  const portMappingRepository = await app.getRepository(PortMappingRepository);

  for (const service of nativeServices) {
    let serviceDB = await serviceRepository.findOne({
      where: {
        name: service.name,
      },
      include: ['port', 'ports'],
    });
    if (serviceDB) {
      // merge new and old data if exist //
      console.log('service DB existing ! ', serviceDB);
    } else {
      serviceDB = await serviceRepository.create({
        name: service.name,
      });
      console.log('creating service : ', serviceDB);
      console.log('creating main port : ', service.port);
      const dPortDB = await portRepository.createIfNotExist(service.port);
      for (const port of service.ports) {
        console.log('adding port : ', port);
        const pDB = await portRepository.createIfNotExist(port);
        await portMappingRepository.create({
          portId: pDB.id,
          serviceId: serviceDB.id,
        });
      }
      await serviceRepository.updateById(serviceDB.id, {
        portId: dPortDB.id,
      });
    }
  }

  // await portRepository.create({
  //   number: 1234,
  // });

  // serviceRepository.createAll([
  //   {
  //     name: 'docker',
  //   }
  // ])
  // const webApp = {
  //   url: appUrl,
  //   name: appName,
  //   icon: appIconToB64(path.resolve(appIcon)),
  // }
  // await webAppRepository.create(webApp);
}

main().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
