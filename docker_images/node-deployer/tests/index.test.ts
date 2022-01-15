import {io} from 'socket.io-client';

import {deployerService} from '../srcs';

import fakePayload from './cluster.payload';

const socket = io('http://localhost:1337');

const validateAction = async (listennerPath, exe, args, waitLast:boolean = true) => {
  await new Promise<void>((resolve, reject) => {
    socket.on(listennerPath, (action) => {
      console.log('test debug', {action, exe, args});
      try {
        expect(action.type).toBe('cmd');
        expect(action.payload.exe).toBe(exe);
        if (args) {
          expect(action.payload.args).toStrictEqual(args);
        }
        if (!waitLast) return resolve();
        if (action.payload.isLast) {
          expect(action.payload.isFirst).toBe(false);
          expect(action.payload.isLast).toBe(true);
          resolve();
        }
      } catch (e) {
        reject(e);
      }
    });
  });
  socket.removeAllListeners(listennerPath);
};

describe('test node-deployer', () => {
  beforeAll(() => {
    deployerService.listen(1337);
  });

  it('Should connect to a server', async () => {
    return new Promise<void>((resolve) => {
      socket.once('connect', () => {
        resolve();
      });
    });
  }, 2000);

  it('should start a deploy and success and get listenner path', async () => {
    const testData = [{
      exe: 'dw',
      args: ['branch', 'development']
    }, {
      exe: 'tar'
    }, {
      exe: 'npm',
      args: ['install'],
    }, {
      exe: 'npm',
      args: ['run', 'test'],
    }, {
      exe: 'npm',
      args: ['start'],
      waitLast: false,
    }];
    socket.emit('/github', fakePayload, "development", () => {});
    for (let test of testData) {
      await validateAction('action', test.exe, test.args, test.waitLast);
    }
  }, 400000);

  afterAll(() => {
    socket.disconnect();
    if (deployerService) {
      deployerService.stop();
    }
  });
});
