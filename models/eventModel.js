const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const EventSchema = new Schema({
    id: Schema.Types.ObjectId,
    place: { geocodes: { latitude: Number, longitude: Number }},
    foursquareData: { id: String, name: String, address: { formattedString: String}, category: { name: String, id: Number }},
    name: String,
    createdBy: String,
    linkedUsers: [String],
    description: String,
    createdAt: Date,
    startDate: Date,
    endDate: Date,
    lastUpdated: Date
  })

module.exports = mongoose.model("EventModel", EventSchema);