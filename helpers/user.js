const { sanitizeObj } = rootRequire('utils');
const { client } = rootRequire('db').redis;
const Boom = require('boom');
const bcrypt = require('bcrypt');

const { userDAO } = rootRequire('commons').DAO;

const redisSessionExpiry = process.env.REDIS_SESSION_EXPIRY_TIME;

async function getAuthenticatedUser({ emailId }) {
  const baseQuery = {};
  baseQuery.email = emailId;
  return userDAO().findOne({ baseQuery });
}

async function getSessionUser(userId) {
  if (!userId) throw Boom.badRequest('User Id is required for setting up the session.');
  const baseQuery = {};
  baseQuery._id = userId;
  return userDAO().findOne({ baseQuery });
}

/** ============================ Redis Utilities ============================= */

function setRedisSession(key, value, noExpiry) {
  return new Promise((resolve, reject) => {
    let _value = sanitizeObj(value);
    _value = JSON.stringify(_value);
    if (noExpiry) {
      client.set(key, _value, (err, response) => {
        if (err) return reject(err);
        resolve(response);
      });
    } else {
      client.set(key, _value, 'EX', redisSessionExpiry, (err, response) => {
        if (err) return reject(err);
        resolve(response);
      });
    }
  });
}

function getRedisSession(key, extendTTL) {
  return new Promise((resolve, reject) => {
    client.get(key, (err, response) => {
      if (err) return reject(err);
      // extending the session data expiry on every get event.
      if (extendTTL) {
        client.expire(key, redisSessionExpiry);
      }
      resolve(JSON.parse(response));
    });
  });
}

function deleteRedisSession(key) {
  return new Promise((resolve, reject) => {
    client.del(key, (err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

function comparePassword(candidatePassword, savedPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, savedPassword, (err, isMatch) => {
      if (err) return reject(err);
      resolve(isMatch);
    });
  });
}

module.exports = {
  getAuthenticatedUser,
  setRedisSession,
  getRedisSession,
  deleteRedisSession,
  getSessionUser,
  comparePassword,
};