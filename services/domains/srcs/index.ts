import {Register} from '@nxtranet/service';
import path from 'path';

const serviceRegister = new Register('domains', 'test token');

(async function main() {
  await serviceRegister.whenReady();
  serviceRegister.fork(path.join(__dirname, './service'));
})();
