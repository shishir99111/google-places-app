const Boom = require('boom');

const { getRedisSession, deleteRedisSession } = rootRequire('helpers').user;

async function logic(req) {
  try {
    const response = await getRedisSession(`user:${req.get('X-ACCESS-TOKEN')}`);
    if (!response) throw Boom.unauthorized('Authentication failed. User not found.');
    const deleteResponse = await deleteRedisSession(`user:${req.get('X-ACCESS-TOKEN')}`);
    if (deleteResponse === 1) {
      return { user_removed: true };
    }
    throw Boom.badRequest('User token does not exists.');
  } catch (e) {
    throw e;
  }
}

function handler(req, res, next) {
  logic(req).then((data) => {
    res.json(data);
  }).catch(err => next(err));
}
module.exports = handler;