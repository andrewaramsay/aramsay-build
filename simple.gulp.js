'use strict';
require('harmonize')();
const requireDir = require('requiredir');
const Logger = require('./utils/logger');
const AppHost = require('./utils/host');
const _ = require('lodash');

class SimpleGulp {
  constructor(options) {
    options = options || {};

    if (options.logger && options.logger instanceof Logger) {
      Logger._current = options.logger
    }

    if (options.host && options.host instanceof AppHost) {
      AppHost._current = options.host;
    }
  }

  buildTasks(gulp) {
    let tasks = requireDir('./tasks').toArray();
    _.forEach(tasks, function (taskBuilder, key) {
      if (_.isFunction(taskBuilder) && key !== 'toArray') {
        taskBuilder(gulp);
      }
    });
  }
}

SimpleGulp.Logger = Logger;
SimpleGulp.AppHost = AppHost;

module.exports = SimpleGulp;
