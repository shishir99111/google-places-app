const logoutHandler = require('./logout.handler');

/**
 * Mounts component specific routes,
 * along with there respective route handlers
 * @param {object} router
 */
module.exports = (router) => {
  router.post('/user/logout', logoutHandler);
};