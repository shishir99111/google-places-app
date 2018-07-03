const { generateCorellationId } = rootRequire('utils');

function requestLogger(router) {
  router.use((req, res, next) => {
    req.locals = {};
    // logger.info(`--> ${req.method} ${req.path}`);
    if (!req.headers['X-CORRELATION-ID']) {
      req.headers['X-CORRELATION-ID'] = generateCorellationId();
    }
    // appending correlation id
    let message = `Correlation id: ${req.headers['X-CORRELATION-ID']}`;

    if (req.body && Object.keys(req.body).length > 0) {
      message = `${message} body: ${JSON.stringify(req.body)}`;
    }
    if (req.query && Object.keys(req.query).length > 0) {
      message = `${message} query: ${JSON.stringify(req.query)}`;
    }
    if (req.headers && Object.keys(req.headers).length > 0) {
      message = `${message} host: ${req.headers.host}`;
    }
    logger.info(message);
    next();
  });
}

module.exports = requestLogger;