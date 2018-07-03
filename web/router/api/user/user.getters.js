const bcrypt = require('bcrypt');

const { SALT_WORK_FACTOR } = rootRequire('constants');

function getHashedPassword(password) {
  return new Promise((resolve, reject) => {
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
      if (err) return reject(err);
      // hash the password using our new salt
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) return reject(err);
        // override the cleartext password with the hashed one
        return resolve(hash);
      });
    });
  });
}

module.exports = {
  getHashedPassword,
};