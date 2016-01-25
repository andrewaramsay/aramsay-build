'use strict';

const _ = require('lodash');
const eslint = require('gulp-eslint');
const path = require('path');

class Inspector {
  constructor(options) {
    const self = this;
    self._setLintFiles(options);
  }

  _setLintFiles(options) {
    const self = this;
    let sourceArray = [].concat(options.source);

    sourceArray = _.map(sourceArray, function (source) {
      return path.join(source, '**/*.js');
    });

    self._lintFiles = [
      ...sourceArray,
      '!node_modules/**'
    ];
  }

  lint() {
    const self = this;
    const gulp = self._gulp;

    let rulesPath = path.join(__dirname, '../rules/');

    console.log(rulesPath);
    self._logger.debug('Linting the following files: ', self._lintFiles);
    return gulp.src(self._lintFiles)
      .pipe(eslint({ rulePaths: [rulesPath] }))
      .pipe(eslint.format());
  }
}

Inspector._default = new Inspector({ source: '' });

module.exports = Inspector;
