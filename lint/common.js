'use strict';
const MAX_CYCLOMATIC_COMPLEXITY = 5;
const MAX_CALLBACK_DEPTH = 3;
const MAX_CONDITIONAL_DEPTH = 3;

const MAX_PARAMETERS_PER_FUNCTION = 4;
const MAX_STATEMENTS_PER_FUNCTION = 30;

const MAX_CONSECUTIVE_EMPTY_LINES = 3;
const MAX_LINE_LENGTH = 200;
const TAB_WIDTH = 4;
const ALLOWED_SPACES_FOR_VAR = 2;
const ALLOWED_SPACES_FOR_LET = 2;
const ALLOWED_SPACES_FOR_CONST = 3;

const MIN_VARIABLE_NAME_LENGTH = 3;


module.exports = {
  rules: {
    'comma-dangle': [2, `never`],
    'no-cond-assign': [2, `always`],
    'no-console': 2,
    'no-constant-condition': 2,
    'no-control-regex': 2,
    'no-debugger': 2,
    'no-dupe-args': 2,
    'no-dupe-keys': 2,
    'no-duplicate-case': 2,
    'no-empty-character-class': 2,
    'no-empty': 2,
    'no-ex-assign': 2,
    'no-extra-boolean-cast': 2,
    'no-extra-parens': [2, `functions`],
    'no-extra-semi': 2,
    'no-func-assign': 2,
    'no-inner-declarations': [2, `both`],
    'no-invalid-regexp': 2,
    'no-irregular-whitespace': 2,
    'no-negated-in-lhs': 2,
    'no-obj-calls': 2,
    'no-regex-spaces': 2,
    'no-sparse-arrays': 2,
    'no-unexpected-multiline': 2,
    'no-unreachable': 2,
    'use-isnan': 2,
    'valid-jsdoc': [2, {
      requireReturn: false,
      prefer: {
        return: `returns`
      }
    }],
    'valid-typeof': 2,
    'accessor-pairs': 2,
    // 'block-scoped-var': 2, // using no-var for ES6.  See what to do about browser code
    complexity: [1, MAX_CYCLOMATIC_COMPLEXITY],
    'consistent-return': 2,
    curly: [2, `all`],
    'default-case': 2,
    'dot-location': [2, `property`],
    'dot-notation': 2,
    eqeqeq: 2,
    'guard-for-in': 2,
    'no-alert': 2,
    'no-caller': 2,
    'no-case-declarations': 2,
    'no-div-regex': 2,
    'no-else-return': 2,
    'no-empty-label': 2,
    'no-empty-pattern': 2,
    'no-eq-null': 2,
    'no-eval': 2,
    'no-extend-native': 2,
    'no-extra-bind': 2,
    'no-fallthrough': 2,
    'no-floating-decimal': 2,
    'no-implicit-coercion': 2,
    'no-implied-eval': 2,
    'no-invalid-this': 2,
    'no-iterator': 2,
    'no-labels': 2,
    'no-lone-blocks': 2,
    'no-loop-func': 2,
    'no-magic-numbers': [2, {
      ignore: [0, 1, 2],
      enforceConst: true,
      detectObjects: true
    }],
    'no-multi-spaces': [2, { exceptions: { Property: false } }],
    'no-multi-str': 2,
    'no-native-reassign': 2,
    'no-new-func': 2,
    'no-new-wrappers': 2,
    'no-new': 2,
    'no-octal-escape': 2,
    'no-octal': 2,
    //'no-param-reassign': 2, // I don't think I like this rule, they don't offer a cleaner way of defaulting, I'd rather just know that it mutates the arugments array
    'no-process-env': 2,
    'no-proto': 2,
    'no-redeclare': [2, { builtinGlobals: true }],
    'no-return-assign': [2, `always`],
    'no-script-url': 2,
    'no-self-compare': 2,
    'no-sequences': 2,
    'no-throw-literal': 2,
    'no-unused-expressions': [2, { allowShortCircuit: true }],
    'no-useless-call': 2,
    'no-useless-concat': 2,
    'no-void': 2,
    'no-with': 2,
    radix: [2, `as-needed`],
    'wrap-iife': [2, `outside`],
    yoda: [2, `never`],
    strict: [2, `global`],
    'init-declarations': [2, `always`],
    'no-catch-shadow': 2,
    'no-delete-var': 2,
    'no-label-var': 2,
    'no-shadow-restricted-names': 2,
    'no-shadow': [2, {
      builtinGlobals: true,
      hoist: `all`
    }],
    'no-undef': [2, { typeof: true }],
    'no-unused-vars': [2, {
      vars: `all`,
      args: `after-used`,
      // Allow an unused variable to contain the word 'ignored' for ignoring destructured positional elements
      varsIgnorePattern: `[iI]gnored`
    }],
    'no-use-before-define': [2, `nofunc`],

    // Stylistic rules
    'array-bracket-spacing': [2, `never`],
    'block-spacing': [2, `always`],
    'brace-style': [2, `1tbs`, {
      allowSingleLine: false
    }],
    camelcase: [2, { properties: `always` }],
    'comma-spacing': [2, { before: false, after: true }],
    'comma-style': [2, `last`],
    'computed-property-spacing': [2, `never`],
    'consistent-this': [2, `self`],
    'eol-last': 2,
    'func-style': [2, `declaration`, { allowArrowFunctions: true }],
    'id-length': [2, { min: MIN_VARIABLE_NAME_LENGTH, exceptions: [`id`, `_`, `$`, `Q`, `q`, `$q`, `ko`, `on`, `ui`, `fs`] }],
    indent: [2, 2, {
      VariableDeclarator: { var: ALLOWED_SPACES_FOR_VAR, let: ALLOWED_SPACES_FOR_LET, const: ALLOWED_SPACES_FOR_CONST },
      SwitchCase: 1
    }],
    'key-spacing': [2, {
      beforeColon: false,
      afterColon: true,
      mode: `strict`
    }],
    'linebreak-style': [2, `unix`],
    'max-depth': [1, MAX_CONDITIONAL_DEPTH],
    'max-len': [2, MAX_LINE_LENGTH, TAB_WIDTH, { ignoreUrls: true }],
    'max-nested-callbacks': [1, MAX_CALLBACK_DEPTH],
    'max-params': [2, MAX_PARAMETERS_PER_FUNCTION],
    'max-statements': [1, MAX_STATEMENTS_PER_FUNCTION],
    'new-cap': 2,
    'new-parens': 2,
    'no-array-constructor': 2,
    'no-bitwise': 2,
    'no-inline-comments': 2,
    'no-lonely-if': 2,
    'no-multiple-empty-lines': [2, { max: MAX_CONSECUTIVE_EMPTY_LINES, maxEOF: 1 }],
    'no-negated-condition': 2,
    'no-nested-ternary': 2,
    'no-new-object': 2,
    'no-plusplus': 2,
    'no-restricted-syntax': [2, `WithStatement`, `LabeledStatement`, `SwitchStatement`, `SwitchCase`],
    'no-spaced-func': 2,
    'no-trailing-spaces': 2,
    // I'd like an end-only no-underscore-dangle rule.  I like to use _foo for private, but want to restrict bar_
    'no-unneeded-ternary': 2,
    'object-curly-spacing': [2, `always`],
    'one-var': [2, `never`],
    'operator-assignment': [2, `always`],
    'operator-linebreak': [2, `before`],
    'quote-props': [2, `as-needed`],
    quotes: [2, `backtick`, `avoid-escape`],
    'semi-spacing': [2, { before: false, after: true }],
    semi: 2,
    'space-after-keywords': [2, `always`],
    'space-before-blocks': [2, `always`],
    'space-before-function-paren': [2, { anonymous: `always`, named: `never` }],
    'space-before-keywords': [2, `always`],
    'space-in-parens': [2, `never`],
    'space-infix-ops': 2,
    'space-return-throw-case': 2,
    'space-unary-ops': [2, { words: true, nonwords: false }],
    'wrap-regex': 2
  }
};
