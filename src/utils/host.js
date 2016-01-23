'use strict';

const nodemon = require('gulp-nodemon');
const Logger = require('./logger');
const path = require('path');
const browserSync = require('browser-sync');
const proxyMiddleware = require('http-proxy-middleware');

class AppHost {
  constructor(options) {
    let self = this;
    options = options || {};
    options.server = options.server || { disabled: true };
    options.client = options.client || { disabled: true };
    self.options = options;
  }

  start() {
    let self = this;

    self._browserSync = browserSync.create();
    self._browserSyncReloadDelay = self.options.server.browserReloadDelay || 3000;
    self._setNodemonOptions(self.options);
    self._setBrowserSyncOptions(self.options);

    if (!self._nodemonOptions) {
      self._startBrowserSync();
      return;
    }

    self._logger.debug('Starting Nodemon with options:', self._nodemonOptions);
    return nodemon(self._nodemonOptions)
      .on('start', function () {
        self._logger.info('Nodemon started');
        self._startBrowserSync();
      })
      .on('restart', function () {
        self._logger.info('Nodemon restarting');
        self._notifyBrowserSyncReload();
      })
      .on('crash', function () {
        self._logger.error('Nodemon crashed');
      })
      .on('exit', function () {
        self._logger.info('Nodemon exited cleanly');
      });
  }


  _setNodemonOptions(options) {
    let self = this;
    if (options.server.disabled) {
      return;
    }

    options.server.watch = options.server.watch || [];
    self._nodemonOptions = {
      script: path.join(options.server.path, options.server.script),
      delayTime: 1,
      env: options.server.environmentVariables || {},
      watch: [options.server.path, ...options.server.watch]
    }
  }

  _setBrowserSyncOptions(options) {
    let self = this;
    self._browserSyncOptions = {
      ui: false,
      files: [options.client.path],
      ghostMode: false,
      online: false,
      browser: options.client.browser,
      reloadOnRestart: true,
      injectChanges: true
    };

    if (options.server && !options.server.disabled) {
      self._configureProxy(options);
    } else {
      self._configureStatic(options);
    }
  }

  _configureProxy(options) {
    let self = this;
    self._configureStatic(options);

    var hostString = options.server.host || 'http://localhost';
    options.server.proxyRoutes = options.server.proxyRoutes || ['/api'];
    self._logger.debug('Proxying API calls to: ', hostString);

    self._browserSyncOptions.middleware = self._browserSyncOptions.middleware || [];
    self._browserSyncOptions.middleware.push(proxyMiddleware(options.server.proxyRoutes, { target: hostString }));
  }

  _configureStatic(options) {
    let self = this;
    self._browserSyncOptions.server = {
      baseDir: ['.']
    };
    self._browserSyncOptions.startPath = options.client.path;
  }

  _startBrowserSync() {
    let self = this;
    if (self._browserSync.active) {
      return;
    }
    self._logger.debug('Starting BrowserSync with options:', self._browserSyncOptions);
    self._browserSync.init(self._browserSyncOptions);
  }

  _notifyBrowserSyncReload() {
    let self = this;
    setTimeout(function () {
      !self._browserSync.notify('Server restarted, reloading...');
      !self._browserSync.reload();
    }, self._browserSyncReloadDelay);
  }
}

class StaticAppHost extends AppHost {
  constructor(clientDirectory) {
    super({
      client: {
        path: clientDirectory
      }
    });
  }
}

AppHost.StaticAppHost = StaticAppHost;

AppHost._default = {
  start: function () {
    this._logger.error('You must configure an app host to use the run:server command');
  }
};

module.exports = AppHost;
