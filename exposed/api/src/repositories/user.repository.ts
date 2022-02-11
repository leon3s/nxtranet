import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasOneRepositoryFactory,
  repository
} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {User, UserCredential} from '../models';
import {UserCredentialRepository} from './user-credential.repository';

export type Credentials = {
  password: string;
  username: string;
};

export type ResetPassword = {
  email: string;
}

export type ChangePassword = {
  token: string;
  password: string;
}

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id
> {
  public readonly userCredential: HasOneRepositoryFactory<
    UserCredential,
    typeof User.prototype.id
  >;

  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
    @repository.getter('UserCredentialRepository')
    protected userCredentialRepositoryGetter: Getter<
      UserCredentialRepository
    >,
  ) {
    super(User, dataSource);
    this.userCredential = this.createHasOneRepositoryFactoryFor(
      'userCredential',
      userCredentialRepositoryGetter,
    );
  }

  async findCredentials(
    userId: typeof User.prototype.id,
  ): Promise<UserCredential | undefined> {
    try {
      return await this.userCredential(userId).get();
    } catch (err) {
      if (err.code === 'ENTITY_NOT_FOUND') {
        return undefined;
      }
      throw err;
    }
  }
}
