const mongoose = require('mongoose');
const bluebird = require('bluebird');

// Setting default SYSTEM PROMISE
mongoose.Promise = bluebird;

const Schema = mongoose.Schema;

// loading all the models
const User = mongoose.model('user', require('./user.schema')(Schema));
const Place = mongoose.model('place', require('./place.schema')(Schema));

// registring models
const model = { User, Place };

module.exports = model;