export * as client from './client';
export * as service from './service';
import * as service from './service';
import {port} from './shared/config';

if (require.main === module) {
  service.prepare().then(() => {
    console.log(`nxtranet dnsmasq service ready on port ${port}`);
  }).catch((err) => {
    console.error(err);
  });
}
