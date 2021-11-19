import {
  authenticate,
  TokenService, UserService
} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {inject} from '@loopback/core';
import {
  model,
  property,
  repository
} from '@loopback/repository';
import {
  get, getModelSchemaRef, HttpErrors, param, post, put, requestBody,
  RequestContext
} from '@loopback/rest';
import {
  SecurityBindings, securityId,
  UserProfile
} from '@loopback/security';
import _ from 'lodash';
import {
  basicAuthorization
} from '../helpers/user_basic.authorizor';
import {validateCredentials} from '../helpers/user_validator';
import {
  PasswordHasherBindings, TokenServiceBindings,
  TokenServiceConstants, UserServiceBindings
} from "../keys";
import {
  User,
  UserCredential
} from '../models';
import {UserRepository} from '../repositories';
import {
  PasswordHasher
} from '../services/hash.password-service';
import {
  OPERATION_SECURITY_SPEC
} from '../utils/security-spec';
import {
  CredentialsRequestBody
} from './specs/user-controller.specs';

@model()
export class NewUserRequest extends User {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

export class UserController {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @inject.context() public context: RequestContext,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public basicService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, UserCredential>,
  ) { }

  @post('/users', {
    description: 'Create new user',
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            title: 'NewUser',
            exclude: ['id', 'creationDate', 'lastConnectionDate', 'isOnline', 'roles'],
          }),
        },
      },
    })
    newUserRequest: NewUserRequest,
  ): Promise<User> {
    // All new users have the "customer" role by default
    newUserRequest.roles = ['user'];
    // ensure a valid email value and password value
    validateCredentials(_.pick(newUserRequest, ['password', 'username']));
    // encrypt the password
    const password = await this.passwordHasher.hashPassword(
      newUserRequest.password,
    );
    try {
      newUserRequest.username =
        newUserRequest.username.toLowerCase();
      const savedUser = await this.userRepository.create(
        _.omit(newUserRequest, 'password'),
      );
      // set the password
      await this.userRepository
        .userCredential(savedUser.id)
        .create({password});
      return savedUser;
    } catch (error) {
      // MongoError 11000 duplicate key
      if (error.code === 11000) {
        if (error.errmsg.includes('index: uniqueUsername')) {
          throw new HttpErrors.Conflict('Username is already taken');
        }
      }
      throw error;
    }
  }

  @post('/users/login', {
    description: 'Login for an user',
    responses: {
      '200': {
        description: 'A valid token for authentication',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: UserCredential,
  ): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);
    // if (!user.roles?.includes('admin')) throw new HttpErrors.Unauthorized();
    const userProfile = this.userService.convertToUserProfile(user);
    // create a JSON Web Token based on the user profile
    const token = await this.basicService.generateToken(userProfile);
    this.context.response.setHeader(
      'Set-Cookie',
      `cc=${token};Domain=.docktron.org;Path=/;Max-Age=${TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE}`,
    );
    return {token};
  }

  @put('/users/{id}', {
    security: OPERATION_SECURITY_SPEC,
    description: 'Update user for given {id}',
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  @authenticate('basic')
  @authorize({
    allowedRoles: ['admin', 'user'],
    voters: [basicAuthorization],
  })
  async setById(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'PatchUser',
            exclude: ['id', 'creationDate', 'lastConnectionDate', 'isOnline', 'roles'],
          }),
        }
      }
    }) user: User,
  ): Promise<User> {
    // Only admin can assign roles
    if (!currentUserProfile.roles.includes('admin')) {
      delete user.roles;
    }
    await this.userRepository.updateById(id, user);
    return this.userRepository.findById(id);
  }

  @get('/users/whoiam', {
    security: OPERATION_SECURITY_SPEC,
    description: 'Get current User for given credentials',
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  @authenticate('basic')
  async printCurrentUser(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<User> {
    const userId = currentUserProfile[securityId];
    const user = await this.userRepository.findById(userId, {
      include: [],
    });
    return user;
  }

  @get('/users/disconnect', {
    description: 'Disconnect current user an remove his token',
    responses: {
      '200': {
        description: '"Ok" if success',
        content: {
          'text/plain': {
            schema: {
              type: 'string',
              example: 'Ok',
            },
          },
        },
      },
    },
  })
  async disconnect(): Promise<string> {
    this.context.response.setHeader(
      'Set-Cookie',
      'cc=' + 'deleted' + ';Domain=.netesport.com;Path=/;Max-Age=-1',
    );
    return "Ok";
  }
}
