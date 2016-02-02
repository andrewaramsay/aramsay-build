'use strict';

module.exports = {
  env: {
    browser: false,
    es6: false
  },
  globals: {
    angular: false
  },
  rules: {
    strict: [2, 'function'],
    'no-magic-numbers': [2, {
      ignore: [0, 1, 2],
      detectObjects: true
    }]
  }
};
