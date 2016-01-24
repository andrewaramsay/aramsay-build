'use strict';

module.exports = {
  env: {
    node: true,
    es6: true,
    mocha: true
  },
  rules: {
    strict: [2, `global`],
    'callback-return': 2,
    'global-require': 2,
    'handle-callback-err': [2, `^.*(e|E)rr`],
    'no-mixed-requires': 2,
    'no-new-require': 2,
    'no-path-concat': 2,
    'no-process-exit': 2,
    'no-sync': 2,
    'no-shadow': [2, {
      builtinGlobals: true,
      hoist: `all`,
      // Allow nested node callbacks to re-use the variable err
      allow: [`err`]
    }],

    // Begin ES6 stuff
    'arrow-body-style': [2, `as-needed`],
    'arrow-parens': [2, `as-needed`],
    'arrow-spacing': [2, { before: true, after: true }],
    'constructor-super': 2,
    'generator-star-spacing': [2, { before: false, after: true }],
    'no-arrow-condition': 2,
    'no-class-assign': 2,
    'no-const-assign': 2,
    'no-dupe-class-members': 2,
    'no-this-before-super': 2,
    'no-var': 2,
    'object-shorthand': 2,
    'prefer-reflect': 2,
    'prefer-spread': 2,
    'prefer-template': 2,
    'require-yield': 2
  }
};
