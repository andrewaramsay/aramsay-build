'use strict';

const _ = require('lodash');
const exec = require('child_process').exec;


class OsUtilities {
  runCommand(command) {
    let self = this;
    return function (callback) {
      self._logger.debug('Running command: ', command);
      exec(command, function (err, stdout, stderr) {
        if (err) {
          self._logger.error(err);
          return callback(err)
        }

        _.forEach(stdout.split('\n'), function (line) {
          if (line.trim()) {
            self._logger.info(line);
          }
        });

        _.forEach(stderr.split('\n'), function (line) {
          if (line.trim()) {
            self._logger.warn(line);
          }
        });
        callback();
      });
    }
  }

  isServiceRunning(serviceName, callback) {
    let self = this;
    exec('sc query "' + serviceName + '"', function (err, stdout, stderr) {
      if (err) {
        self._logger.error(err);
        return callback(err)
      }

      if (_.includes(stdout, 'RUNNING')) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    });
  }

  startService(serviceName) {
    let self = this;
    return function startServiceTask(callback) {
      self.isServiceRunning(serviceName, function (err, isRunning) {
        if (err) {
          return callback(err);
        }

        if (!isRunning) {
          self.runCommand('net start ' + serviceName)(callback);
        } else {
          self._logger.info('The', serviceName, 'service is already running.')
          callback();
        }
      });
    };
  }

  stopService(serviceName) {
    let self = this;
    return function stopServiceTask(callback) {
      self.isServiceRunning(serviceName, function (err, isRunning) {
        if (err) {
          return callback(err);
        }

        if (isRunning) {
          self.runCommand('net stop ' + serviceName)(callback);
        } else {
          self._logger.info('The', serviceName, 'service is already stopped.')
          callback();
        }
      });
    };
  }
}


module.exports = OsUtilities;
