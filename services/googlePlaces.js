const Boom = require('boom');
const rp = require('request-promise').defaults({ encoding: null });

const { INPUT_TYPE, KEYS, URL } = rootRequire('constants');

async function getPlacesData(keyword) {
  try {
    const endPoint = `${URL['FIND_PLACE_FROM_TEXT']}?input=${keyword}&inputtype=${INPUT_TYPE}&fields=${KEYS}&key=${process.env.GOOGLE_PLACES_KEY}`;
    let response = await rp.get(endPoint);
    response = JSON.parse(response);
    if (response.status === 'OK') return response.candidates;
  } catch (e) {
    throw Boom.badRequest(e);
  }
}

module.exports = {
  getPlacesData,
};