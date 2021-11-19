import {NextranetApi} from '../application';

const [
  execName,
  scriptName,
  appName,
  appUrl,
  appIcon,
] = process.argv;

const main = async () => {
  const app = new NextranetApi();
  await app.boot();
  // const webAppRepository = await app.getRepository(WebAppRepository);
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
