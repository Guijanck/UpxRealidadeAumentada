module.exports = {
  root: true,
  extends: [
    'plugin:react/recommended',
    'plugin:react-native/all',
    'eslint:recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  plugins: ['react', 'react-native', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'react/prop-types': 'off',
    'react-native/no-inline-styles': 'off',
  },
};
