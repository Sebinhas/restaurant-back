const Review = require('../models/mongo/reviewModel');

// Crear una reseña
exports.createReview = async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json({ message: 'Reseña creada exitosamente', data: review });
  } catch (error) {
    res.status(400).json({ message: 'Error al crear la reseña', error: error.message });
  }
};

// Obtener todas las reseñas
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json({ message: 'Reseñas obtenidas exitosamente', data: reviews });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reseñas', error: error.message });
  }
}; 