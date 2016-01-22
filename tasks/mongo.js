'use strict';

var startService = require('../utils/os').startService;
var stopService = require('../utils/os').stopService;

module.exports = function (gulp) {
	gulp.task('mongo:restart', ['mongo:stop'], startService('MongoDB'));
	gulp.task('mongo:start', startService('MongoDB'));
	gulp.task('mongo:stop', stopService('MongoDB'));
}
