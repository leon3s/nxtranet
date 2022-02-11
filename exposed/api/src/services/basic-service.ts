import {TokenService} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {TokenRepository} from '../repositories';

export class BASICService implements TokenService {
  constructor(
    @repository(TokenRepository) private tokenRepository: TokenRepository,
  ) { }

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : 'token' is null`,
      );
    }
    let userProfile: UserProfile;
    try {
      // decode user profile from token
      const decodedToken = await this.tokenRepository.verify(token);
      // don't copy over  token field 'iat' and 'exp', nor 'email' to user profile
      userProfile = Object.assign(
        {[securityId]: '', username: ''},
        {
          [securityId]: decodedToken.id,
          username: decodedToken.username,
          id: decodedToken.id,
        },
      );
    } catch (error) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : ${error.message}`,
      );
    }
    return userProfile;
  }

  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized(
        'Error generating token : userProfile is null',
      );
    }
    const userInfoForToken = {
      id: userProfile[securityId],
      username: userProfile.username,
    };
    let token: string;
    try {
      token = (await this.tokenRepository.generate(userInfoForToken.username)).value;
    } catch (error) {
      throw new HttpErrors.Unauthorized(`Error encoding token : ${error}`);
    }
    return token;
  }
}
