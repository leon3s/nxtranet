import {ApplicationConfig} from './application';
import {ExpressServer} from './server';
export * from './application';

export async function main(options: ApplicationConfig = {}) {
  const app = new ExpressServer(options);
  await app.boot();
  await app.start();

  const url = `http://${app.host}:${app.port}`;
  console.log(`Server is running at ${url}`);
  return app;
}

if (require.main === module) {
  // Run the application
  const config = {
    rest: {
      port: +(process.env.PORT ?? 1444),
      host: process.env.HOST || 'localhost',
      expressSettings: {
        'x-powered-by': false,
        env: 'production',
      },
      apiExplorer: {
        disabled: process.env.NODE_ENV === 'production' ? true : false,
      },
      openApiSpec: {
        disabled: process.env.NODE_ENV === 'production' ? true : false,
        // useful when used with OpenAPI-to-GraphQL to locate your application
        setServersFromRequest: true,
        endpointMapping: {
          '/openapi.json': {version: '3.0.0', format: 'json'},
        }
      },
      requestBodyParser: {
        limit: '100MB',
      },
      cors: {
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
        // maxAge: 86400,
        credentials: true,
      },
      // The `gracePeriodForClose` provides a graceful close for http/https
      // servers with keep-alive clients. The default value is `Infinity`
      // (don't force-close). If you want to immediately destroy all sockets
      // upon stop, set its value to `0`.
      // See https://www.npmjs.com/package/stoppable
      gracePeriodForClose: 5000, // 5 seconds
      // Use the LB4 application as a route. It should not be listening.
      listenOnStart: false,
    },
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
