const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    userId: String,
    latitude: Number,
    longitude: Number,
    timestamp: { type: Date, default: Date.now },
});
module.exports = {
    locationSchema: mongoose.model('location_schema', locationSchema)
}