import path from 'path';
import {Register} from '@nxtranet/service';

const serviceRegister = new Register('nginx', 'test token');

(async function main() {
  console.log('registering service !');
  await serviceRegister.whenReady();
  console.log('ready');
  serviceRegister.fork(path.join(__dirname, './service'));
})();
