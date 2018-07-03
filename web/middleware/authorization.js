const Boom = require('boom');

const { getRedisSession } = rootRequire('helpers').user;

function authorization(router) {
  router.use((req, res, next) => {
    // validate user and X-ACCESS-TOKEN
    const token = req.get('X-ACCESS-TOKEN');
    if (!token) return next(Boom.unauthorized('Unauthorized access'));
    const extendTTL = true;
    getRedisSession(`user:${token}`, extendTTL).then((response) => {
      if (!response) throw Boom.gatewayTimeout('Authentication failed, Session already expired.');
      /** req.user population using redis session */
      const userObject = JSON.parse(JSON.stringify(response.data));
      req.user = userObject;
      next();
    }).catch((err) => {
      logger.error(`The error while fetching user privileges ${err}`);
      next(err);
    });
  });
}

module.exports = authorization;