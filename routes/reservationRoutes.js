const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

// Rutas para reservas
router.get('/', reservationController.getAllReservations);
router.get('/:id', reservationController.getReservationById);
router.post('/', reservationController.createReservation);
router.put('/:id', reservationController.updateReservation);
router.delete('/:id', reservationController.deleteReservation);

// Ruta para filtrar reservas
router.get('/filter', reservationController.filterReservations);

module.exports = router; 