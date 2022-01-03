import {TokenService, UserService} from '@loopback/authentication';
import {BindingKey} from '@loopback/context';
import {User} from './models';
import {Credentials} from './repositories';
import {DockerService} from './services/docker-service';
import {GithubService} from './services/github-service';
import {PasswordHasher} from './services/hash.password-service';
import {NginxService} from './services/nginx-service';
import ProjectService from './services/project-service';
import {ProxiesService} from './services/proxies-service';
import {WebsocketService} from './websocket';

export namespace NginxServiceBindings {
  export const NGINX_SERVICE = BindingKey.create<NginxService>(
    'service.nginx',
  )
}

export namespace ProjectServiceBindings {
  export const PROJECT_SERVICE = BindingKey.create<ProjectService>(
    'service.project',
  )
}

export namespace GithubServiceBindings {
  export const GITHUB_SERVICE = BindingKey.create<GithubService>(
    'service.github',
  )
}

export namespace WebSockerServiceBindings {
  export const WEBSOCKET_SERVICE = BindingKey.create<WebsocketService>(
    'service.websocket',
  )
}

export namespace DockerServiceBindings {
  export const DOCKER_SERVICE = BindingKey.create<DockerService>(
    'services.docker',
  )
}

export namespace ProxiesServiceBindings {
  export const PROXIES_SERVICE = BindingKey.create<ProxiesService>(
    'services.subdomain',
  )
}

export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = 'mys3cr3t';
  export const TOKEN_EXPIRES_IN_VALUE = '99999';
}

export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>(
    'authentication.basic.secret',
  );
  export const TOKEN_EXPIRES_IN = BindingKey.create<string>(
    'authentication.basic.expires.in.seconds',
  );
  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.authentication.basic.token.service',
  );
}

export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>(
    'services.hasher',
  );
  export const ROUNDS = BindingKey.create<number>('services.hasher.round');
}

export namespace UserServiceBindings {
  export const USER_SERVICE = BindingKey.create<UserService<User, Credentials>>(
    'services.user.service',
  );
}
