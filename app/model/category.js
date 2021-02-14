const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const CategorySchema = mongoose.Schema({
  name: { type: String, required: true },
  parent: { type: mongoose.SchemaTypes.ObjectId, ref: 'Category', default: null },
}, { timestamps: true, toJSON: { virtuals: true }});

CategorySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Category', CategorySchema);