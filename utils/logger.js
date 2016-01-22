'use strict';

const _ = require('lodash');
const moment = require('moment');
const chalk = require('chalk');

const LEVELS = {
  debug: 1,
  info: 2,
  warn: 3,
  error: 4
};

class Logger {
  constructor(options) {
    this.configure(options);
  }

  configure(options) {
    options = options || {};
    if (_.isNumber(options.level)) {
      this.currentLevel = options.level;
    } else {
      this.currentLevel = LEVELS[options.level] || LEVELS.info;
    }

    if (_.isFunction(options.objectSerializer)) {
      this.serializeObject = options.objectSerializer;
    } else {
      this.serializeObject = o => JSON.stringify(o);
    }
  }

  log(...messages) {
    this.info(...messages);
  }

  debug(...messages) {
    this._writeMessage(LEVELS.debug, chalk.green('DEBUG'), ...messages);
  }

  info(...messages) {
    this._writeMessage(LEVELS.info, chalk.blue('INFO'), ...messages);
  }

  warn(...messages) {
    this._writeMessage(LEVELS.warn, chalk.yellow('WARN'), ...messages);
  }

  error(...messages) {
    this._writeMessage(LEVELS.error, chalk.red('ERROR'), ...messages);
  }

  _checkLevel(levelNumber) {
    levelNumber = levelNumber || 999;
    return levelNumber >= this.currentLevel;
  }

  _writeMessage(levelNumber, status, ...messages) {
    var self = this;
    if (!self._checkLevel(levelNumber)) {
      return;
    }

    var messageContent = _.map(messages, function (msg) {
      if (_.isObject(msg)) {
        return self.serializeObject(msg);
      } else {
        return _.trim(msg);
      }
    }).join(' ');

    var message =
      chalk.white('[')
      + chalk.gray(self._timestamp())
      + chalk.white('] [')
      + status
      + chalk.white('] ')
      + chalk.white(messageContent);

    console.log(message);
  }

  _timestamp() {
    return moment().format('HH:mm:ss');
  }
}

Logger.LEVELS = LEVELS;

Logger._current = new Logger({
  level: LEVELS.info
});


module.exports = Logger;
