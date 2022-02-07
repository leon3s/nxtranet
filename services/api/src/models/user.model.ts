import {
  Entity, hasOne,
  model,
  property
} from '@loopback/repository';
import {
  UserCredential
} from './user-credential.model';

@model({
  settings: {
    strict: true,
    indexes: {
      uniqueUsername: {
        keys: {
          username: 1,
        },
        options: {
          unique: true,
        },
      },
    },
  },
})
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    mongodb: {dataType: 'ObjectID'},
  })
  id: string;

  @property({
    type: 'Date',
    defaultFn: 'now',
  })
  creationDate?: Date;

  @property({
    type: 'Date',
    defaultFn: 'now',
  })
  lastConnectionDate?: Date;

  @property({
    type: 'string',
    description: "Username of user",
  })
  username: string;

  @property({
    type: 'boolean',
    default: false,
    description: "Define if user is online or not",
  })
  isOnline?: boolean;

  @hasOne(() => UserCredential)
  userCredential: UserCredential;

  @property({
    type: 'array',
    itemType: 'string',
    description: "Roles array for acl",
  })
  roles?: string[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}
