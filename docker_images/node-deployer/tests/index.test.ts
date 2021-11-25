import {io} from 'socket.io-client';

import {sockServ} from '../srcs';

import fakePayload from './cluster.payload';

let listennerPath:string | null = null;

const socket = io('http://localhost:1337');
let listenner = null;

const printer = (d) => {
  console.log('FIRST LISTENNER');
  console.dir(d, {depth:null});
  console.log('-------------');
}

const validateAction = async (listennerPath, exe, args?) => {
  await new Promise<void>((resolve, reject) => {
    socket.on(listennerPath, (action) => {
      console.log({action, exe, args});
      try {
        expect(action.type).toBe('cmd');
        expect(action.payload.exe).toBe(exe);
        if (args) {
          expect(action.payload.args).toStrictEqual(args);
        }
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
    sockServ.listen(1337);
  });

  it('Should connect to a server', async () => {
    return new Promise<void>((resolve) => {
      socket.once('connect', () => {
        resolve();
      });
    });
  }, 2000);

  it('should start a deploy and success and get listenner path', (done) => {
    socket.emit('/github', fakePayload, "master", async (err, res) => {
      if (err) return done(err);
      const {statusUrl} = res.payload;
      listennerPath = statusUrl.toString();
      try {
        const testData = [{
          exe: 'dw',
          args: ['branch', 'master']
        }, {
          exe: 'tar'
        }, {
          exe: 'npm',
          args: ['install'],
        }, {
          exe: 'npm',
          args: ['run', 'test'],
        }];
        for (let test of testData) {
          await validateAction(listennerPath, test.exe, test.args);
        }
        done();
      } catch (err) {
        done(err);
      }
    });
  }, 400000);

  afterAll(() => {
    socket.disconnect();
    if (sockServ) {
      sockServ.close();
    }
  });
});
