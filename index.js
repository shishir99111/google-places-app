const path = require('path');

/**
 * Bootstrap application file
 *
 * This is the main entry point of the application.
 * It will load configurations, initialize the app and start the express server
 */

require('dotenv').config({ path: path.join(__dirname, '/.env') });

// Set globals
require('./globals');

const { mongoose } = rootRequire('./db');

// Initializing config

mongoose.init(() => {
  logger.info('Mongo connection created');
});

// Running the required scripts
/** Updating the database for logging the IP informations */
const { createFolders } = require('./scripts');

createFolders.init(['log']);

// Start server
const { appServer } = require('./web/server');

require('./gracefullyShutDown')(appServer);