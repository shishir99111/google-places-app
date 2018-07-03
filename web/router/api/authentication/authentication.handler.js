const Joi = require('joi');
const Boom = require('boom');
const moment = require('moment');
const uuidv5 = require('uuid/v5');

const { getErrorMessages } = rootRequire('utils');
const { authValidationJoi } = rootRequire('commons').joi;
const {
  getAuthenticatedUser,
  setRedisSession,
  getSessionUser,
  comparePassword,
} = rootRequire('helpers').user;

async function logic(req) {
  try {
    const { error } = Joi.validate(req.body, authValidationJoi);
    if (error) throw Boom.badRequest(getErrorMessages(error));

    // user email should always be in lower-case
    req.body.email = req.body.email.toLowerCase();

    const user = await getAuthenticatedUser({ emailId: req.body.email });
    if (!user) throw Boom.badRequest('Invalid Email Address or Password');

    if (!user.is_active) {
      throw Boom.badRequest('Your account is not active.');
    }

    if (!req.body.password) throw Boom.unauthorized('Please provide password');
    const isMatch = await comparePassword(req.body.password, user.password);
    if (!isMatch) {
      throw Boom.unauthorized('Invalid Email Address or Password');
    }

    /** deleting sensitive user's information */
    delete user.password;
    /** Setting redis session for authenticated user  */
    const sessionUser = await getSessionUser(user._id);
    if (!sessionUser) throw Boom.badImplementation('User\'s session cannot be set');

    // ... using predefined DNS namespace (for domain names)
    const sid = uuidv5(`${moment().format()}_${user._id}`, process.env.SHA1_NAMESPACE);

    const payloads = {
      login_time: moment().format(),
      last_activity_at: moment().format(),
      data: sessionUser,
    };
    await setRedisSession(`user:${sid}`, payloads);
    return { token: sid, user: sessionUser };
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