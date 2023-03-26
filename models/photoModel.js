const mongoose = require("mongoose");
const { find } = require('./../models/photoModel');
const Schema = mongoose.Schema;

const PhotoSchema = new Schema({
  id: Schema.Types.ObjectId,
  eventId: String,
  createdBy: String,
  createdAt: Date,
  fullSizeUrl: String,
  thumbnailUrl: String
});

PhotoSchema.methods.toiOSClient = function () {
    var response = {
        id: this._id,
        eventId: this.eventId,
        createdBy: this.createdBy,
        createdAt: this.createdAt,
        fullSizeUrl: this.fullSizeUrl
    }
    if (this.thumbnailUrl != null) {
        response.thumbnailUrl = this.thumbnailUrl;
    } else {
        response.thumbnailUrl = this.fullSizeUrl;
    }
    return response;
}

module.exports = mongoose.model("PhotoModel", PhotoSchema);