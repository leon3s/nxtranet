const next = require('next');
const express = require('express');

const port = +(process.env.PORT || 3001);
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, '127.0.0.1', (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
