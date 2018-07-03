/**
 * Mounts component specific routes,
 * along with there respective route handlers
 * @param {object} router
 */

module.exports = (router) => {
  // Rounte to check the HeartBeat of Application
  router.get('/ping', (req, res) => {
    res.status(200).send('pong');
  });
};