import Proxy from "./proxy";
import {readConfig, watchConfig} from './config';

const port = +(process.env.PORT ?? 5454);

const config = readConfig();
const proxy = new Proxy(config);

watchConfig((domains) => {
  console.log('updating nextranet proxy domains : ', {
    domains,
  });
  proxy.updateDomains(domains);
});

proxy.listen(port);

console.log(`nextranet proxy started on port ${port}`);
