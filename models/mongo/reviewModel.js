const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  visitType: { type: String, required: true, enum: ['Familiar', 'Negocios', 'Pareja', 'Amigos', 'Individual'] },
  visitDate: { type: Date, required: true },
  calification: { type: Number, required: true, min: 1, max: 5 },
  consumedDishes: [{ type: String, required: true }],
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);