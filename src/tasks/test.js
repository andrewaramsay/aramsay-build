'use strict';
const gulpMocha = require('gulp-mocha');

module.exports = function (simpleBuild) {
  const gulp = simpleBuild.gulp;

  gulp.task('test', ['test:server']);
  gulp.task('test:watch', ['test:server:watch']);


  gulp.task('test:server', function () {
    return gulp.src('./src/server/**/*.spec.js', { read: false })
      .pipe(gulpMocha({ reporter: 'spec' }));
  });

  gulp.task('test:server:watch', ['test:server'], function () {
    gulp.watch('./src/server/**/*.js', ['test:server']);
  });

};
