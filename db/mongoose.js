const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const database = rootRequire('config/mongo');

let db;

function init(cb) {
  const options = {
    server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
  };

  if (process.env.NODE_ENV) {
    db = mongoose.connect(database.connectionString, options);
  } else {
    // disabled in production since index creation can cause a significant performance impact
    db = mongoose.connect(database.connectionString,
      Object.assign({}, { config: { autoIndex: false } }, options));
  }
  autoIncrement.initialize(db);
  logger.info(`Connection url: ${database.connectionString}`);

  // CONNECTION EVENTS
  // When successfully connected
  mongoose.connection.on('connected', () => {
    logger.info(`Mongoose default connection open to ${database.DB_URI} / ${database.DB_NAME}`);
    cb();
  });

  // If the connection throws an error
  mongoose.connection.on('error', (err) => {
    logger.error(`Mongoose default connection error: ${err}`);
    throw err;
  });

  // When the connection is disconnected
  mongoose.connection.on('disconnected', () => {
    logger.info('Mongoose default connection disconnected');
  });

  // LOADING MODELS
  rootRequire('models');
}


module.exports = { init };