'use strict';

const nodemon = require(`gulp-nodemon`);
const path = require(`path`);
const browserSync = require(`browser-sync`);
const proxyMiddleware = require(`http-proxy-middleware`);

const DEFAULT_BROWSER_SYNC_DELAY = 3000;

class AppHost {
  constructor(options) {
    const self = this;
    options = options || {};
    options.server = options.server || { disabled: true };
    options.client = options.client || { disabled: true };
    self.options = options;
  }

  start() {
    const self = this;

    self._browsersync = browserSync.create();
    self._browserSyncReloadDelay = self.options.server.browserReloadDelay || DEFAULT_BROWSER_SYNC_DELAY;
    self._setNodemonOptions(self.options);
    self._setBrowserSyncOptions(self.options);

    if (!self._nodemonOptions) {
      self._startBrowsersync();
      return { on: event => self._logger.warn(`Nodemon not running, event [${event}] will never fire.`) };
    }

    self._logger.debug(`Starting Nodemon with options:`, self._nodemonOptions);

    return nodemon(self._nodemonOptions)
      .on(`start`, function () {
        self._logger.info(`Nodemon started`);
        self._startBrowsersync();
      })
      .on(`restart`, function () {
        self._logger.info(`Nodemon restarting`);
        self._notifyBrowserSyncReload();
      })
      .on(`crash`, function () {
        self._logger.error(`Nodemon crashed`);
      })
      .on(`exit`, function () {
        self._logger.info(`Nodemon exited cleanly`);
      });
  }


  _setNodemonOptions(options) {
    const self = this;
    if (options.server.disabled) {
      return;
    }

    options.server.watch = options.server.watch || [];
    self._nodemonOptions = {
      script: path.join(options.server.path, options.server.script),
      delayTime: 1,
      env: options.server.environmentVariables || {},
      watch: [options.server.path, ...options.server.watch]
    };
  }

  _setBrowserSyncOptions(options) {
    const self = this;
    self._browsersyncOptions = {
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
    const self = this;
    self._configureStatic(options);

    let hostString = options.server.host || `http://localhost`;
    options.server.proxyRoutes = options.server.proxyRoutes || [`/api`];
    self._logger.debug(`Proxying API calls to: `, hostString);

    self._browsersyncOptions.middleware = self._browsersyncOptions.middleware || [];
    self._browsersyncOptions.middleware.push(proxyMiddleware(options.server.proxyRoutes, { target: hostString }));
  }

  _configureStatic(options) {
    const self = this;
    self._browsersyncOptions.server = {
      baseDir: [`.`]
    };
    self._browsersyncOptions.startPath = options.client.path;
  }

  _startBrowsersync() {
    const self = this;
    if (self._browsersync.active) {
      return;
    }
    self._logger.debug(`Starting BrowserSync with options:`, self._browsersyncOptions);
    self._browsersync.init(self._browsersyncOptions);
  }

  _notifyBrowserSyncReload() {
    const self = this;
    setTimeout(function () {
      self._browsersync.notify(`Server restarted, reloading...`);
      self._browsersync.reload();
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
  start() {
    this._logger.error(`You must configure an app host to use the run:server command`);
  }
};

module.exports = AppHost;
