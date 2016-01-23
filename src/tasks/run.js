'use strict';

module.exports = function (simpleBuild) {
  let gulp = simpleBuild.gulp;
  gulp.task('run:server', ['mongo:start', 'build'], function () {
    simpleBuild.host.start();
	});
};
