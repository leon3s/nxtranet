import axios from 'axios';
import fs from 'fs';
import {client, service} from '../srcs';
import {port} from '../srcs/shared/config';

const filename = 'nginx-test-file';
const content = `
server {
  server_name nginx-test.com;
  listen 127.0.0.1:80;

  location / {
      proxy_set_header upgrade $http_upgrade;
      proxy_set_header connection "upgrade";
      proxy_http_version 1.1;
      proxy_set_header x-forwarded-for $proxy_add_x_forwarded_for;
      proxy_set_header host $host;
      proxy_pass http://127.0.0.1:${port};
  }
}
`;

const testRes = "nginx: the configuration file /etc/nginx/nginx.conf syntax is ok\nnginx: configuration file /etc/nginx/nginx.conf test is successful"

describe('Test nginx service', () => {

  beforeAll(async () => {
    await service.prepare();
    client.connect();
  });

  it('It should create an nginx file under /etc/nginx/sites-available', async () => {
    await client.sitesAvailableWrite({
      filename,
      content
    });

    expect(fs.existsSync(`/etc/nginx/sites-available/${filename}`)).toBe(true);
  });

  it('It should deploy have sites-available file existing', async () => {
    const res = await client.sitesAvailableExists({
      filename,
    });
    expect(res).toBe(true);
  });

  it('It should match file content if we read it', async () => {
    const res = await client.sitesAvailableRead({
      filename,
    });
    expect(res).toBe(content);
  });

  it('It should exist in list of sites-available file', async () => {
    const res = await client.sitesAvailable();
    expect(res).toEqual(expect.any(Array));
    const file = res.find(({name}) => {
      return name === filename;
    });
    expect(file.name).toBe(filename);
    expect(file.content).toBe(content);
  });

  it('It should create a link to sites-enabled folder', async () => {
    await client.sitesAvailableDeploy({
      filename,
    });
    expect(fs.existsSync(`/etc/nginx/sites-enabled/${filename}`)).toBe(true);
  });

  it('It should have sites-enabled file existing', async () => {
    const res = await client.sitesEnableExists({
      filename,
    });
    expect(res).toBe(true);
  });

  it('It should pass the test config', async () => {
    const res = await client.test();
    expect(res).toBe(testRes);
  });

  it('It should reload nginx service and expose nginx-test.com', async () => {
    await client.reload();
    await new Promise<void>((resolve) => {
      setTimeout(async () => {
        resolve();
      }, 1000)
    })
  });

  it('It should have nginx-test.com exposed', async () => {
    const res = await axios.get('http://127.0.0.1', {
      headers: {
        Host: "nginx-test.com"
      }
    });
    expect(res.data.uptime).toEqual(expect.any(Number));
  });

  it('It should delete an nginx file under /etc/nginx/sites-available and /etc/nginx/sites-enabled', async () => {
    await client.sitesDelete({
      filename,
    });

    expect(fs.existsSync(`/etc/nginx/sites-available/${filename}`)).toBe(false);
    expect(fs.existsSync(`/etc/nginx/sites-enabled/${filename}`)).toBe(false);
  });

  afterAll(() => {
    client.disconnect();
    service.close();
  });
});
