const next = require('next');
const express = require('express');

const port = +(process.env.PORT || 3001);
const dev = process.env.NODE_ENV !== 'production';

console.log('DASHBOARD ENV !!! ', process.env);

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
