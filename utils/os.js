'use strict';

const _ = require('lodash');
const exec = require('child_process').exec;
const logger = require('./logger')._current;


function runCommand(command) {
  return function (callback) {
    logger.debug('Running command: ', command);
    exec(command, function (err, stdout, stderr) {
      if (err) {
        logger.error(err);
        return callback(err)
      }

      _.forEach(stdout.split('\n'), function (line) {
        if (line.trim()) {
          logger.info(line);
        }
      });

      _.forEach(stderr.split('\n'), function (line) {
        if (line.trim()) {
          logger.warn(line);
        }
      });
      callback();
    });
  }
}

function isServiceRunning(serviceName, callback) {
  exec('sc query "' + serviceName + '"', function (err, stdout, stderr) {
    if (err) {
      logger.error(err);
      return callback(err)
    }

    if (_.includes(stdout, 'RUNNING')) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  });
}

function startService(serviceName) {
  return function startServiceTask(callback) {
    isServiceRunning(serviceName, function (err, isRunning) {
      if (err) {
        return callback(err);
      }

      if (!isRunning) {
        runCommand('net start ' + serviceName)(callback);
      } else {
        logger.info('The', serviceName, 'service is already running.')
        callback();
      }
    });
  };
}

function stopService(serviceName) {
  return function startServiceTask(callback) {
    isServiceRunning(serviceName, function (err, isRunning) {
      if (err) {
        return callback(err);
      }

      if (isRunning) {
        runCommand('net stop ' + serviceName)(callback);
      } else {
        logger.info('The', serviceName, 'service is already stopped.')
        callback();
      }
    });
  };
}

module.exports = {
  runCommand,
  isServiceRunning,
  startService,
  stopService
};
