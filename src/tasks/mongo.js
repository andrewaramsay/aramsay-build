'use strict';

module.exports = function (simpleBuild) {
  let gulp = simpleBuild.gulp;

  gulp.task(`mongo:restart`, [`mongo:stop`], simpleBuild.os.startService(`MongoDB`));
  gulp.task(`mongo:start`, simpleBuild.os.startService(`MongoDB`));
  gulp.task(`mongo:stop`, simpleBuild.os.stopService(`MongoDB`));
};
