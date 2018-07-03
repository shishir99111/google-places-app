const assert = require('assert');

let Schema = null;

function init() {
  const addressComponents = new Schema({
    long_name: { type: String },
    short_name: { type: String },
    types: [{ type: String }],
  });

  const geometry = new Schema({
    location: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    location_type: { type: String },
    viewport: {
      northeast: {
        lat: { type: Number, default: 0 },
        lng: { type: Number, default: 0 },
      },
      southwest: {
        lat: { type: Number, default: 0 },
        lng: { type: Number, default: 0 },
      },
    },
  });

  const photo = {
    height: { type: Number, default: true },
    html_attributions: [{ type: String }],
    photo_reference: { type: String },
    width: { type: Number, default: true },
  };

  const ObjectId = Schema.Types.ObjectId;
  const placeSchema = new Schema({
    user_id: { type: ObjectId, ref: 'user' },
    address_components: [addressComponents],
    formatted_address: { type: String },
    name: { type: String },
    place_id: { type: String },
    types: [{ type: String }],
    photos: [photo],
    rating: [{ type: String }],
    geometry,
  }, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

  return placeSchema;
}

module.exports = (schema) => {
  assert.ok(schema);
  Schema = schema;
  return init();
};