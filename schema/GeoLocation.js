const mongoose = require('mongoose');

// Define the schema for geographic data
const GeoLocationSchema = new mongoose.Schema({
  userCid: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Create a model based on the schema
const GeoLocation = mongoose.model('GeoLocation', GeoLocationSchema);

module.exports = GeoLocation;
