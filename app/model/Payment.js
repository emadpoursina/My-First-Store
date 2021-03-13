const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePagination = require('mongoose-paginate');

const paymentSchema = Schema({
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User'},
  product: { type: Schema.Types.ObjectId, required: true, ref: 'Course'},
  price: { type: Number, required: true },
  status: { type: Number, required: true },
  resNumber: { type: String, required: true },
}, { timestamps: true, toJSON: { virtuals: true }});

paymentSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Payment', paymentSchema);