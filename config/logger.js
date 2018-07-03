const { transports, Logger } = require('winston');
const WinstonDailyRotateFile = require('winston-daily-rotate-file');
const moment = require('moment');

const env = process.env.NODE_ENV;
const { toUTCDate, getAppName } = rootRequire('utils');

const appName = getAppName();

const currentTransports = [
  new WinstonDailyRotateFile({
    filename: './log/-results.log',
    timestamp: toUTCDate(moment().format()),
    datePattern: 'yyyy-MM-dd',
    prepend: true,
    json: false,
    formatter: (options) => {
      const meta = (options.meta && Object.keys(options.meta).length ? `\n\t ${JSON.stringify(options.meta)}` : '');
      const result = {
        timestamp: toUTCDate(moment().format()),
        app: appName,
        level: options.level.toUpperCase(),
        reqInfo: undefined !== options.message ? options.message : '',
        meta: meta,
      };
      return JSON.stringify(result);
      // return `${options.timestamp} ${appName} ${options.level.toUpperCase()} ${options.message} ${meta}`;
    },
    handleExceptions: false,
    level: env === 'development' ? 'debug' : 'info',
  }),
];

if (['development', 'staging'].indexOf(env) !== -1) {
  currentTransports.push(new transports.Console({
    colorize: true,
    timestamp: toUTCDate(moment().format()),
    handleExceptions: false,
    json: false,
    level: 'debug',
    formatter: (options) => {
      const meta = (options.meta && Object.keys(options.meta).length ? `\n\t ${JSON.stringify(options.meta)}` : '');
      return `${toUTCDate(moment().format())} - ${appName} - ${options.level.toUpperCase()} - ${undefined !== options.message ? options.message : ''} - ${meta}`;
    },
  }));
}

const logginLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  },
};

const logger = new Logger({
  transports: currentTransports,
  levels: logginLevels.levels,
  exitOnError: false,
});

module.exports = logger;

module.exports.stream = {
  write: (message) => {
    logger.info(message);
  },
};