const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  calification: { type: Number, required: true },
  comment: { type: String, required: true },
  visitType: { type: String, required: true },
  date: { type: Date, default: Date.now },
  consumedDishes: [{ type: String }],
});

module.exports = mongoose.model('Review', reviewSchema);