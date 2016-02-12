'use strict';

module.exports = function (simpleBuild) {
  const gulp = simpleBuild.gulp;
  gulp.task('run:server', ['mongo:start', 'build:wire'], function () {
    simpleBuild.host.start();
  });
};
