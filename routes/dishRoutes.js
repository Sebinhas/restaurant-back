const express = require('express');
const router = express.Router();
const dishController = require('../controllers/dishController');

// Rutas para platos
router.get('/', dishController.getAllDishes);
router.get('/:id', dishController.getDishById);
router.post('/', dishController.createDish);
router.put('/:id', dishController.updateDish);
router.delete('/:id', dishController.deleteDish);

// Ruta para buscar/filtrar platos
router.get('/find', dishController.findDishes);

module.exports = router; 