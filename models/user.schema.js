const assert = require('assert');

let Schema = null;

function init() {
  const logs = new Schema({
    previous: {},
  });
  const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    is_active: { type: Boolean, required: true, default: true },
    logs: [logs],
  }, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

  return userSchema;
}

module.exports = (schema) => {
  assert.ok(schema);
  Schema = schema;
  return init();
};