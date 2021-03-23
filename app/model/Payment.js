const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const paymentSchema = Schema({
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User'},
  product: { type: Schema.Types.ObjectId, default: null, ref: 'Course'},
  vip: { type: Boolean, default: false },
  price: { type: Number, required: true },
  status: { type: Number, required: true },
  resNumber: { type: String, required: true },
}, { timestamps: true, toJSON: { virtuals: true }});

paymentSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Payment', paymentSchema);