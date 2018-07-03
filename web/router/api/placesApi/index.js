const getResultForKeywordHandler = require('./getResultForKeyword.handler');
const getSearchByUserId = require('./getSearchesByUserId.handler');

/**
 * Mounts component specific routes,
 * along with there respective route handlers
 * @param {object} router
 */

module.exports = (router) => {
  router.get('/places', getResultForKeywordHandler);
  router.get('/searches', getSearchByUserId);
};