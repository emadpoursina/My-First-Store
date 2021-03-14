const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema;

const permissionSchema = new Schema({
  name: { type: String, required: true },
  label: { type: String, required: true },
}, { timestamps: true, toJSON:{ virtuals: true } });

permissionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Permission', permissionSchema);