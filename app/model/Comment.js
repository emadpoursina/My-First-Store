const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const CommentSchema = new mongoose.Schema({
  user: { type: mongoose.SchemaTypes.ObjectId, ref: 'user'},
  parent: { type: mongoose.SchemaTypes.ObjectId, ref: 'comment', default: null},
  approved: {type: Boolean, default: false},
  course: { type: mongoose.SchemaTypes.ObjectId, ref: 'course', default: undefined},
  episode: { type: mongoose.SchemaTypes.ObjectId, ref: 'episode', default: undefined},
}, { timestamps: true });

CommentSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Comment', CommentSchema);