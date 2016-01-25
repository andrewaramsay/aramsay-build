'use strict';
require('harmonize')();
const _ = require('lodash');
const path = require('path');
const requireDir = require('requiredir');

const Logger = require('./utils/logger');
const AppHost = require('./utils/host');
const Wire = require('./utils/wire');
const OsUtilities = require('./utils/os');
const Inspector = require('./utils/inspector');

class SimpleBuild {
  constructor(options, gulp) {
    const self = this;
    options = options || {};
    self.options = options;
    self.gulp = gulp;

    self._initComponent(options, 'logger', Logger);
    self._initComponent(options, 'host', AppHost);
    self._initComponent(options, 'wire', Wire);
    self._initComponent(options, 'os', OsUtilities);
    self._initComponent(options, 'inspector', Inspector);

    self.taskGroups = requireDir(path.join(__dirname, './tasks'));
  }

  _initComponent(options, componentName, ComponentType) {
    const self = this;
    if (options && options[componentName] && options[componentName] instanceof ComponentType) {
      self[componentName] = options[componentName];
    } else {
      self[componentName] = ComponentType._default || new ComponentType();
    }

    self[componentName]._logger = self.logger;
    self[componentName]._gulp = self.gulp;
  }

  buildTasks() {
    const self = this;
    _.forEach(self.taskGroups.toArray(), function (taskBuilder, key) {
      if (_.isFunction(taskBuilder) && key !== 'toArray') {
        taskBuilder(self);
      }
    });
  }
}

SimpleBuild.Logger = Logger;
SimpleBuild.AppHost = AppHost;
SimpleBuild.Wire = Wire;
SimpleBuild.Inspector = Inspector;

module.exports = SimpleBuild;
