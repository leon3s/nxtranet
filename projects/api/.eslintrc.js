module.exports = {
  extends: '@loopback/eslint-config',
  rules: {
    'no-invalid-this': 0,
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/naming-convention': 'off',
  },
  ignorePatterns: ["/src/__tests__"]
};
