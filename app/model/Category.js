const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const CategorySchema = mongoose.Schema({
  name: { type: String, required: true },
  parent: { type: mongoose.SchemaTypes.ObjectId, ref: 'Category', default: null },
}, { timestamps: true, toJSON: { virtuals: true }});

CategorySchema.plugin(mongoosePaginate);

CategorySchema.virtual('childs', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent',
});

module.exports = mongoose.model('Category', CategorySchema);