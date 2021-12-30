import {NextranetApi} from '../application';
import {PortRepository, ServiceRepository} from '../repositories';

const main = async () => {
  const app = new NextranetApi();
  await app.boot();
  const serviceRepository = await app.getRepository(ServiceRepository);

  const portRepository = await app.getRepository(PortRepository);

  const isReserved = await portRepository.isReservedPort(1243);

  if (isReserved) {
    console.error('Port number ' + 1234 + ' is reserved');
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
