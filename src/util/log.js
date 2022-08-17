"use strict";

const signale = require("signale");

const logger = (error) => {
  signale.fatal(error);
};

module.exports = logger;
