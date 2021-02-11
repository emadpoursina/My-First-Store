const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const CommentSchema = new mongoose.Schema({
  user: { type: mongoose.SchemaTypes.ObjectId, ref: 'User'},
  parent: { type: mongoose.SchemaTypes.ObjectId, ref: 'Comment', default: null},
  approved: {type: Boolean, default: false},
  course: { type: mongoose.SchemaTypes.ObjectId, ref: 'Course', default: undefined},
  episode: { type: mongoose.SchemaTypes.ObjectId, ref: 'Episode', default: undefined},
  comment: {type: String, required: true },
}, {timestamps: true, toJSON: { virtuals: true }});

CommentSchema.plugin(mongoosePaginate);

CommentSchema.virtual('childs', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parent',
});

module.exports = mongoose.model('Comment', CommentSchema);