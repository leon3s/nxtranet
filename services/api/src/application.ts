import {AuthenticationComponent} from '@loopback/authentication';
import {AuthorizationComponent} from '@loopback/authorization';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, createBindingFromClass} from '@loopback/core';
import {HttpServer} from '@loopback/http-server';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import websocketServer from 'socket.io';
import {BASICAuthenticationStrategy} from './authentication-strategies/basic-strategy';
import {
  DnsmasqServiceBindings,
  DockerServiceBindings,
  GithubServiceBindings,
  NginxServiceBindings,
  PasswordHasherBindings,
  ProjectServiceBindings,
  ProxiesServiceBindings,
  SystemServiceBindings,
  TokenServiceBindings,
  TokenServiceConstants,
  UserServiceBindings
} from './keys';
import ServiceLifecycle from './lifecycles/services-lifecycles';
import {MySequence} from './sequence';
import {BASICService} from './services/basic-service';
import {DnsmasqService} from './services/dnsmasq-service';
import {DockerService} from './services/docker-service';
import {GithubService} from './services/github-service';
import {BcryptHasher} from './services/hash.password-service';
import {NginxService} from './services/nginx-service';
import ProjectService from './services/project-service';
import {ProxiesService} from './services/proxies-service';
import {SystemService} from './services/system-service';
import {MyUserService} from './services/user-service';

export {ApplicationConfig};

export class NextranetApi extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  readonly httpServer: HttpServer;
  readonly wServer: websocketServer.Server;

  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.setupBindings();
    this.lifeCycleObserver(ServiceLifecycle);
    // Bind authentication component related elements
    this.component(AuthenticationComponent);
    this.component(AuthorizationComponent);

    // Set up the custom sequence
    // this.sequence(MyAuthenticationSequence);

    // authentication
    this.add(createBindingFromClass(BASICAuthenticationStrategy));

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
      docExpansion: 'none',
      indexTitle: 'api - nxtranet',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  setupBindings() {

    this.bind(SystemServiceBindings.SYSTEM_SERVICE)
      .toClass(SystemService);

    this.bind(DnsmasqServiceBindings.DNSMASQ_SERVICE)
      .toClass(DnsmasqService);

    this.bind(NginxServiceBindings.NGINX_SERVICE)
      .toClass(NginxService);

    this.bind(GithubServiceBindings.GITHUB_SERVICE)
      .toClass(GithubService);

    this.bind(DockerServiceBindings.DOCKER_SERVICE)
      .toClass(DockerService);

    this.bind(ProxiesServiceBindings.PROXIES_SERVICE)
      .toClass(ProxiesService);

    this.bind(ProjectServiceBindings.PROJECT_SERVICE)
      .toClass(ProjectService);

    this.bind(TokenServiceBindings.TOKEN_SECRET)
      .to(TokenServiceConstants.TOKEN_SECRET_VALUE);

    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN)
      .to(TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE);

    this.bind(TokenServiceBindings.TOKEN_SERVICE)
      .toClass(BASICService);

    // // Bind bcrypt hash services
    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER)
      .toClass(BcryptHasher);

    this.bind(UserServiceBindings.USER_SERVICE)
      .toClass(MyUserService);
  }
}
