'use strict';

const _ = require('lodash');
const exec = require('child_process').exec;


class OsUtilities {
  runCommand(command) {
    const self = this;
    return function (callback) {
      self._logger.debug(`Running command: ${command}`);
      exec(command, function (err, stdout, stderr) {
        if (err) {
          self._logger.error(err);
          return callback(err);
        }

        self._logOutput(stdout, 'info');
        self._logOutput(stderr, 'warn');

        callback();
      });
    };
  }

  isServiceRunning(serviceName, callback) {
    const self = this;
    exec(`sc query "${serviceName}"`, function (err, stdout, stderr) {
      if (err) {
        self._logger.error(err);
        return callback(err);
      }

      self._logOutput(stderr, 'warn');

      if (_.includes(stdout, 'RUNNING')) {
        return callback(null, true);
      }

      callback(null, false);
    });
  }

  startService(serviceName) {
    const self = this;
    return self._toggleService(serviceName, true);
  }

  stopService(serviceName) {
    const self = this;
    return self._toggleService(serviceName, false);
  }

  _toggleService(serviceName, start) {
    const self = this;
    return function (callback) {
      self.isServiceRunning(serviceName, function (err, isRunning) {
        if (err) {
          return callback(err);
        }

        let command = start ? 'start' : 'stop';
        let expectedStatus = start ? 'running' : 'stopped';

        if (isRunning === start) {
          self._logger.info(`The ${serviceName} service is already ${expectedStatus}.`);
          return callback();
        }

        self.runCommand(`net ${command} ${serviceName}`)(callback);
      });
    };
  }

  _logOutput(streamOutput, logFunc) {
    const self = this;
    _.forEach(streamOutput.split('\n'), function (line) {
      if (line.trim()) {
        self._logger[logFunc](line);
      }
    });
  }
}


module.exports = OsUtilities;
