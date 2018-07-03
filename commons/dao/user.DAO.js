const MODEL = rootRequire('models').User;
const DAO = require('./DAO'); // return constructor function.

function UserDAO() {
  this.Model = MODEL;
}

// Prototypal Inheritance
UserDAO.prototype = new DAO();

module.exports = () => new UserDAO();