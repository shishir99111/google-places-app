const { requestLogger, authorization, sanitizeRequestObj } = require('../middleware');
const router = require('express').Router();

requestLogger(router);

sanitizeRequestObj(router);

/** Open routes */
require('./api/public')(router);

require('./api/authentication')(router);

authorization(router);

/** Secured routes */
require('./api/user')(router);
require('./api/placesApi')(router);

/**
 * Mounting respective paths.
 * @param {object} app Express instance
 */
module.exports = (app) => {
  app.use('/api/v1', router);
};