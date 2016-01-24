'use strict';

const _ = require('lodash');
const moment = require('moment');
const chalk = require('chalk');

const DEBUG = 1;
const INFO = 2;
const WARN = 3;
const ERROR = 4;
const SILENT = 999;

const LEVELS = {
  debug: DEBUG,
  info: INFO,
  warn: WARN,
  error: ERROR,
  silent: SILENT
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
      this.currentLevel = LEVELS[options.level] || INFO;
    }

    if (_.isFunction(options.objectSerializer)) {
      this.serializeObject = options.objectSerializer;
    } else {
      this.serializeObject = obj => JSON.stringify(obj);
    }
  }

  log(...messages) {
    this.info(...messages);
  }

  debug(...messages) {
    this._writeMessage(DEBUG, chalk.green('DEBUG'), ...messages);
  }

  info(...messages) {
    this._writeMessage(INFO, chalk.blue('INFO'), ...messages);
  }

  warn(...messages) {
    this._writeMessage(WARN, chalk.yellow('WARN'), ...messages);
  }

  error(...messages) {
    this._writeMessage(ERROR, chalk.red('ERROR'), ...messages);
  }

  _checkLevel(levelNumber) {
    levelNumber = levelNumber || SILENT;
    return levelNumber >= this.currentLevel;
  }

  _writeMessage(levelNumber, status, ...messages) {
    const self = this;
    if (!self._checkLevel(levelNumber)) {
      return;
    }

    let messageContent = _.map(messages, function (msg) {
      if (_.isObject(msg)) {
        return self.serializeObject(msg);
      }

      return _.trim(msg);
    }).join(' ');

    let message = chalk.white('[')
      + chalk.gray(self._timestamp())
      + chalk.white('] [')
      + status
      + chalk.white('] ')
      + chalk.white(messageContent);

    /* eslint no-console: 0 */
    console.log(message);
  }

  _timestamp() {
    return moment().format('HH:mm:ss');
  }
}

Logger.Levels = LEVELS;

Logger._default = new Logger({
  level: INFO
});


module.exports = Logger;
