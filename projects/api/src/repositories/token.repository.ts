import {inject} from '@loopback/core';
import {DefaultCrudRepository, repository} from '@loopback/repository';
import crypto from 'crypto';
import {MongoDbDataSource} from '../datasources';
import {Token, TokenRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class TokenRepository extends DefaultCrudRepository<
  Token,
  typeof Token.prototype.id,
  TokenRelations
> {
  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {
    super(Token, dataSource);
  }

  protected _generateValue = () =>
    `nxtp_${crypto.randomBytes(8).toString('hex')}`;

  verify = async (token: string): Promise<User> => {
    const [username, value] = Buffer.from(token, 'base64').toString('ascii').split(':');
    const tokenDB = await this.findOne({
      where: {
        username,
        value,
      }
    });
    if (!tokenDB) throw new Error('Unauthorized');
    const user = await this.userRepository.findOne({
      where: {
        username: tokenDB.username,
      }
    });
    if (!user) throw new Error('Token exist but user is deleted.');
    return user;
  }

  generate = (username: string): Promise<Token> => {
    return this.create({
      username,
      value: this._generateValue(),
    });
  }
}
