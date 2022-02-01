import {NextranetApi} from '../application';

const main = async () => {
  const app = new NextranetApi();
  await app.boot();
  // const serviceRepository = await app.getRepository(ServiceRepository);
}

main().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
