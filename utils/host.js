'use strict';

const nodemon = require('gulp-nodemon');
const Logger = require('./logger');
const path = require('path');

class AppHost {
  constructor(options) {
    options = options || {};
    this._setNodemonOptions(options);
  }

  _setNodemonOptions(options) {
    this.nodemonOptions = {
      script: options.serverScript,
      delayTime: 1,
      env: options.environmentVariables || {}
    }
  }

  start() {
    Logger._current.debug('Nodemon Options:', this.nodemonOptions);
    return nodemon(this.nodemonOptions)
      .on('start', function () {
        Logger._current.info('Nodemon started');
        // TODO: Start Browsersync
      })
      .on('restart', function () {
        Logger._current.info('Nodemon restarting');
        // TODO: Reload Browsersync
      })
      .on('crash', function () {
        Logger._current.error('Nodemon crashed');
      })
      .on('exit', function () {
        Logger._current.info('Nodemon exited cleanly');
      });
  }
}

AppHost._current = new AppHost({
  serverScript: path.join(__dirname, '../host/mock-host.js'),
  environmentVariables: {}
});

module.exports = AppHost;
