const Joi = require('joi');
const Boom = require('boom');

const { placeDAO } = rootRequire('commons').DAO;

const { getPlacesData } = rootRequire('services').googlePlaces;

function savePlaceInfoForUser(placeData, userId) {
  return placeDAO().save({...placeData[0], user_id: userId });
}

async function logic({ query, user }) {
  try {
    const validationJoi = Joi.object().keys({
      keyword: Joi.string().required(),
    });

    const { error } = Joi.validate(query, validationJoi);
    if (error) throw Boom.badRequest('Please provide valid keyword');

    const result = await getPlacesData(query.keyword);

    await savePlaceInfoForUser(result, user._id);

    return result;
  } catch (e) {
    throw e;
  }
}

function handler(req, res, next) {
  logic(req).then((data) => {
    logResponse(req, data);
    res.json(data);
  }).catch(err => next(err));
}
module.exports = handler;