'use strict';

const path = require('path');
const indexHtml = path.join(__dirname, '../resources/template.index.html');
const rename = require('gulp-rename');
const conflict = require('gulp-conflict');

module.exports = function (simpleBuild) {
  let gulp = simpleBuild.gulp;

  gulp.task('build', ['build:wiredep']);

  gulp.task('build:wiredep', function () {
    return simpleBuild.wire.wire();
  });

  gulp.task('build:init-index', function () {
    return gulp.src(indexHtml)
      .pipe(rename(simpleBuild.options.client.index || 'index.html'))
      .pipe(conflict(simpleBuild.options.client.path))
      .pipe(gulp.dest(simpleBuild.options.client.path));
  });

  gulp.task('build:bundle', ['build:wiredep'], function () {
    return simpleBuild.wire.bundle();
  });
};
