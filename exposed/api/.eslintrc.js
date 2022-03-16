module.exports = {
  extends: '@loopback/eslint-config',
  rules: {
    "semicolon": [true, "always"],
    "no-invalid-this": 0,
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/naming-convention': 'off',
    "sort-imports": 0,
  },
  ignorePatterns: ["/src/__tests__"]
};
