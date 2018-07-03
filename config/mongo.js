const joi = require('joi');

const envVarsSchema = joi.object({
  DB_NAME: joi.string().valid(['hdfc-assignment', 'hdfc-assignment-test', 'hdfc-assignment-staging', 'hdfc-assignment-production']).required(),
  DB_URI: joi.string().required(),
}).unknown().required();

const { error, value: envVars } = joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  DB_NAME: envVars.DB_NAME,
  DB_URI: envVars.DB_URI, // 'adminHdfc:Internet1!@161.202.19.190:27017'
  connectionString: `mongodb://${envVars.DB_URI}/${envVars.DB_NAME}`,
  useMongoClient: true,
};

module.exports = config;