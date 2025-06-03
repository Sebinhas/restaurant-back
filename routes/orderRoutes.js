const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Rutas para pedidos
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.post('/', orderController.createOrder);
router.put('/:id', orderController.updateOrder); // Basic update (e.g., total)
router.delete('/:id', orderController.deleteOrder);

// Ruta para buscar/filtrar pedidos
router.get('/find', orderController.findOrders);

module.exports = router; 