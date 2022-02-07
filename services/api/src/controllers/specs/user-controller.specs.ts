import {SchemaObject} from '@loopback/rest';

export const UserProfileSchema: SchemaObject = {
  type: 'object',
  required: ['id', 'username'],
  properties: {
    id: {type: 'string'},
    username: {type: 'string'},
  },
};

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['username', 'password'],
  properties: {
    username: {
      type: 'string',
      example: [
        "leone",
        "tasha"
      ]
    },
    password: {
      type: 'string',
      minLength: 8,
      example: "12345678"
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

const ResetPassWordSchema: SchemaObject = {
  type: 'object',
  required: ['email'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
  },
}

export const ResetPasswordRequestBody = {
  description: 'Email of the user',
  required: true,
  content: {
    'application/json': {
      schema: ResetPassWordSchema,
    },
  },
};

const ChangePasswordByTokenBodySchema: SchemaObject = {
  type: 'object',
  required: [
    'token',
    'password',
  ],
  properties: {
    token: {
      type: 'string',
    },
    password: {
      type: 'string',
      minLength: 8,
    }
  }
}

export const ChangePasswordByTokenBody = {
  description: 'Change user password by token',
  required: true,
  content: {
    'application/json': {
      schema: ChangePasswordByTokenBodySchema,
    }
  }
}
