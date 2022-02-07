import {HttpErrors} from '@loopback/rest';
import {Credentials} from '../repositories';

export function validateCredentials(credentials: Credentials) {
  // Validate Email
  if (!credentials?.username || !credentials?.username?.length) {
    throw new HttpErrors.UnprocessableEntity('Invalid username');
  }
  const username = credentials.username.replace(/ /g, '').toLowerCase();
  if (!username.length) {
    throw new HttpErrors.UnprocessableEntity('Invalid username');
  }
  // Validate Password Length
  if (!credentials.password || credentials.password.length < 8) {
    throw new HttpErrors.UnprocessableEntity(
      'password must be minimum 8 characters',
    );
  }
}
