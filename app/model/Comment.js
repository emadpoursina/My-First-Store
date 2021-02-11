const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const CommentSchema = new mongoose.Schema({
  user: { type: mongoose.SchemaTypes.ObjectId, ref: 'User'},
  parent: { type: mongoose.SchemaTypes.ObjectId, ref: 'Comment', default: null},
  approved: {type: Boolean, default: true},
  course: { type: mongoose.SchemaTypes.ObjectId, ref: 'Course', default: undefined},
  episode: { type: mongoose.SchemaTypes.ObjectId, ref: 'Episode', default: undefined},
  comment: {type: String, required: true },
}, {timestamps: true, toJSON: { virtuals: true }});

CommentSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Comment', CommentSchema);