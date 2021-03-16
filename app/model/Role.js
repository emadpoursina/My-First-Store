const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const RoleSchema = mongoose.Schema({
  name: { type: String, required: true },
  label: { type: String, required: true },
  permissions: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Permission' }],
}, { timestamps: true, toJSON: { virtuals: true }});

RoleSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Role', RoleSchema);