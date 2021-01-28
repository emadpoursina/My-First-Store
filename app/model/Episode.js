const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate'); 
const EpisodeController = require("../http/controller/admin/EpisodeController");

const episodeSchema = mongoose.Schema({
    course: {type: mongoose.Schema.Types.ObjectId, ref: 'Course'},
    title: {type: String, required: true},
    type: {type: String, required: true},
    body: {type: String, required: true},
    time: {type: String, default: "00:00:00"},
    number: {type: Number, required: true},
    videoUrl: {type: String, required: true},
    downloadCoutn: {type: Number, default: 0},
    viewCount: {type: Number, default: 0},
    commentCount: {type: Number, default: 0},
}, {timestamps: true});

episodeSchema.plugin(mongoosePaginate);

episodeSchema.methods.typeToPersian = function() {
  switch (this.type) {
    case "cash":
      return "نقدی";
    case "vip":
      return "اعضای ویژه";
    default:
      return "رایگان";
  }
}

module.exports = new mongoose.model('Episode', episodeSchema);