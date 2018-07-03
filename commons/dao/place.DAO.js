const MODEL = rootRequire('models').Place;
const DAO = require('./DAO'); // return constructor function.

function PlaceDAO() {
  this.Model = MODEL;
}

// Prototypal Inheritance
PlaceDAO.prototype = new DAO();

module.exports = () => new PlaceDAO();