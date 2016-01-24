'use strict';
require('harmonize')();
const _ = require('lodash');
const requireDir = require('requiredir');

const Logger = require('./utils/logger');
const AppHost = require('./utils/host');
const Wire = require('./utils/wire');
const OsUtilities = require('./utils/os');
const Inspector = require('./utils/inspector');

class SimpleBuild {
  constructor(options, gulp) {
    let self = this;
    options = options || {};
    self.options = options;
    self.gulp = gulp;

    self._initComponent(options, 'logger', Logger);
    self._initComponent(options, 'host', AppHost);
    self._initComponent(options, 'wire', Wire);
    self._initComponent(options, 'os', OsUtilities);
    self._initComponent(options, 'inspector', Inspector);
  }

  _initComponent(options, componentName, ComponentType) {
    let self = this;
    if (options && options[componentName] && options[componentName] instanceof ComponentType) {
      self[componentName] = options[componentName];
    } else {
      self[componentName] = ComponentType._default || new ComponentType();
    }

    self[componentName]._logger = self.logger;
    self[componentName]._gulp = self.gulp;
  }

  buildTasks() {
    let self = this;
    let tasks = requireDir('./tasks').toArray();
    _.forEach(tasks, function (taskBuilder, key) {
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
