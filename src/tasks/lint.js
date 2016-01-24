'use strict';

module.exports = function (simpleBuild) {
  let gulp = simpleBuild.gulp;

  gulp.task('lint:watch', ['lint'], function () {
    gulp.watch(simpleBuild.inspector._lintFiles, ['lint']);
  });

  gulp.task('lint', function () {
    return simpleBuild.inspector.lint();
  });
};
