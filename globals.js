// list of all the properties binded to Global Scope
const path = require('path');

global.rootRequire = (name) => {
  const module = require(path.join(__dirname, name)); // eslint-disable-line
  return module;
};

global.logger = require('./config/logger');
global._ = require('lodash');

global.logResponse = (req, data) => {
  // appending correlation id
  let message = `Correlation id: ${req.headers['X-CORRELATION-ID']}`;
  message = `${message} response: ${JSON.stringify(data)}`;
  logger.info(message);
};

global.PROJECT_ROOT_DIRECTORY = path.resolve(__dirname);