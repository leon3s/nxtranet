module.exports = {
  extends: '@loopback/eslint-config',
  rules: {
    "semicolon": [2, "always"],
    "no-invalid-this": 0,
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/naming-convention': 'off',
    "sort-imports": 0,
    "indent": [
      "error",
      2
    ]
  },
  parserOptions: {
    project: "./tsconfig.json"
  },
  ignorePatterns: ["/src/__tests__"]
};
