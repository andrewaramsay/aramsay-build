'use strict';

const gulp = require(`gulp`);
const SimpleBuild = require(`./src/simple.build`);
const Logger = SimpleBuild.Logger;

let simpleBuild = new SimpleBuild({
  logger: new Logger({ level: Logger.Levels.debug })
}, gulp);

require(`./src/tasks/quality`)(simpleBuild);
