import {
  asAuthStrategy,
  AuthenticationStrategy,
  TokenService
} from '@loopback/authentication';
import {bind, inject} from '@loopback/context';
import {
  asSpecEnhancer,
  mergeSecuritySchemeToSpec,
  OASEnhancer,
  OpenApiSpec
} from '@loopback/openapi-v3';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {TokenServiceBindings} from '../keys';

@bind(asAuthStrategy, asSpecEnhancer)
export class BASICAuthenticationStrategy
  implements AuthenticationStrategy, OASEnhancer {
  name = 'basic';

  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public tokenService: TokenService,
  ) { }

  public async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token: string = this.extractCredentials(request);
    const userProfile: UserProfile = await this.tokenService.verifyToken(token);
    return userProfile;
  }

  extractCredentials(request: Request): string {
    let token = null;
    if (request.headers.cookie) {
      const cookies = request.headers.cookie.split(';');
      cookies.forEach((item, i) => {
        if (item.trim().startsWith('cc=')) {
          token = item.split('=').pop();
        }
      });
    }
    if (token) return token;
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized(`Authorization not found.`);
    }

    // for example : Basic base64(`username:token`)
    const authHeaderValue = request.headers.authorization;

    if (!authHeaderValue.startsWith('Basic')) {
      throw new HttpErrors.Unauthorized(
        `Authorization header is not of type 'Basic'.`,
      );
    }

    //split the string into 2 parts : 'Bearer ' and the `xxx.yyy.zzz`
    const parts = authHeaderValue.split(' ');
    if (parts.length !== 2)
      throw new HttpErrors.Unauthorized(
        `Authorization header value has too many parts. It must follow the pattern: 'Basic base64(username:password)'`,
      );

    token = parts[1];
    return token;
  }

  modifySpec(spec: OpenApiSpec): OpenApiSpec {
    return mergeSecuritySchemeToSpec(spec, this.name, {
      type: 'http',
      scheme: 'basic',
    });
  }
}
