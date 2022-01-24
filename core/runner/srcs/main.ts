import {fork} from 'child_process';

const child = fork('./index.ts');

console.log('Service started on with child : ', child.pid);
