'use strict';

const path = require('path');
const indexHtml = path.join(__dirname, '../resources/template.index.html');
const rename = require('gulp-rename');
const conflict = require('gulp-conflict');

module.exports = function (simpleBuild) {
  const gulp = simpleBuild.gulp;

  gulp.task('build', ['build:bundle', 'build:bundle:fonts', 'build:images']);

  gulp.task('build:wiredep', function () {
    return simpleBuild.wire.wire();
  });

  gulp.task('build:init-index', function () {
    // TODO: Mov this in to a class so it can be tested and overridden
    return gulp.src(indexHtml)
      .pipe(rename(simpleBuild.options.client.index || 'index.html'))
      .pipe(conflict(simpleBuild.options.client.path))
      .pipe(gulp.dest(simpleBuild.options.client.path));
  });

  gulp.task('build:clean', function (done) {
    simpleBuild.wire.cleanBuild(done);
  });

  gulp.task('build:clean:temp', function (done) {
    simpleBuild.wire.cleanTemp(done);
  });

  gulp.task('build:bundle', ['build:wire', 'build:inject-templates', 'build:clean'], function () {
    return simpleBuild.wire.bundle();
  });

  gulp.task('build:inject-templates', ['build:templates'], function () {
    return simpleBuild.wire.injectTemplateCache();
  });

  gulp.task('build:templates', ['build:clean:temp'], function () {
    return simpleBuild.wire.buildTemplateCache();
  });

  gulp.task('build:wire', ['build:wiredep', 'build:styles'], function () {
    return simpleBuild.wire.wireStyles();
  });

  gulp.task('build:styles', ['build:clean:temp'], function () {
    return simpleBuild.wire.compileStyles();
  });

  gulp.task('build:bundle:fonts', ['build:clean'], function () {
    return simpleBuild.wire.bundleFonts();
  });

  gulp.task('build:images', ['build:clean'], function () {
    return simpleBuild.wire.buildImages();
  });
};
