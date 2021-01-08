const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const courseController = require("../http/controller/admin/courseController");
const Schema = mongoose.Schema;

const CourseSchema = Schema({
    user:{type: Schema.Types.ObjectId, ref: "User"},
    title:{type: String, required: true},
    slug:{type: String, required: true},
    type:{type: String, required: true},
    body:{type: String, required: true},
    images:{type: Object, required: true},
    price:{type: Number, required: true},
    tags:{type: String, required: true},
    time:{type: String, default: "00:00:00"},
    viewCount: {type: Number, default: 0},
    commentCount: {type: Number, default: 0},
}, {timeStamps: true})

CourseSchema.plugin(mongoosePaginate);

CourseSchema.methods.typeToPersian = function() {
  switch (this.type) {
    case "cash":
      return "نقدی";
    case "vip":
      return "اعضای ویژه";
    default:
      return "رایگان";
  }
}

module.exports = mongoose.model("Course", CourseSchema);