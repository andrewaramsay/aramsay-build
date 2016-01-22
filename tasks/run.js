'use strict';

var AppHost = require('../utils/host');

module.exports = function (gulp) {
	gulp.task('run:server', ['mongo:start'], function () {
	  AppHost._current.start();
	});
};
