const mongoose = require("mongoose");
const { find } = require('./../models/eventModel');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  id: Schema.Types.ObjectId,
  location: { type: { type: String }, coordinates: [Number] },
  foursquareData: { id: String, name: String, address: { formattedString: String }, category: { name: String, id: Number } },
  name: String,
  createdBy: String,
  linkedUsers: [String],
  description: String,
  createdAt: Date,
  startDate: Date,
  endDate: Date,
  destroyDate: Date,
  lastUpdated: Date
});


// TODO: y u no work
// EventSchema.statics.getAllNearby = function (longitude, latitude, radius) {
//   return this.find({
//     location: {
//       $geoWithin: {
//         $centerSphere: [[longitude, latitude], radius]
//       }
//     }
//   });
// }

EventSchema.methods.toiOSClient = function () {
  return {
    id: this._id,
    name: this.name,
    createdBy: this.createdBy,
    description: this.description,
    startDate: this.startDate,
    endDate: this.endDate,
    destroyDate: this.destroyDate,
    location: { longitude: this.location.coordinates[0], latitude: this.location.coordinates[1] },
    foursquareData: { id: this.foursquareData.id, name: this.foursquareData.name, address: { formattedString: this.foursquareData.address.formattedString }, category: { name: this.foursquareData.category.name, id: this.foursquareData.category.id } }
  }
}

EventSchema.index({
  "location": "2dsphere"
});

module.exports = mongoose.model("EventModel", EventSchema);