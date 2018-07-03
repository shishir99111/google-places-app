const Boom = require('boom');

const { placeDAO } = rootRequire('commons').DAO;

async function getSearchData(userId) {
  const baseQuery = {};
  baseQuery.user_id = userId;
  return placeDAO().find({ baseQuery });
}

async function logic({ user }) {
  try {
    const result = await getSearchData(user._id);
    return result;
  } catch (e) {
    throw Boom.badRequest(e);
  }
}

function handler(req, res, next) {
  logic(req).then((data) => {
    logResponse(req, data);
    res.json(data);
  }).catch(err => next(err));
}
module.exports = handler;