const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate'); 
const bcrypt = require('bcrypt');

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

episodeSchema.methods.download = function() {
  const timestamps = new Date().getTime() + 3600 * 1000;

  const text = `lsdjflksdjfkldsjf${this.id}${timestamps}`;
  const salt = bcrypt.genSaltSync(15);
	const hash = bcrypt.hashSync(text, salt);

  return `/download/${this.id}?mac=${hash}&t=${timestamps}`;
}

module.exports = new mongoose.model('Episode', episodeSchema);