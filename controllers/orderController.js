const orderModel = require('../models/postgres/orderModel');

const orderController = {
  async getAllOrders(req, res) {
    try {
      const orders = await orderModel.getAll();
      res.status(200).json({ message: 'Pedidos obtenidos exitosamente', data: orders });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener pedidos', error: error.message });
    }
  },

  async getOrderById(req, res) {
    try {
      const order = await orderModel.getById(req.params.id);
      if (order == null) {
        return res.status(404).json({ message: 'Pedido no encontrado' });
      }
      res.status(200).json({ message: 'Pedido obtenido exitosamente', data: order });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener pedido', error: error.message });
    }
  },

  async createOrder(req, res) {
    try {
      const { customer_id, dishes } = req.body;
      const newOrder = await orderModel.create(customer_id, dishes);
      res.status(201).json({ message: 'Pedido creado exitosamente', data: newOrder });
    } catch (error) {
      res.status(400).json({ message: 'Error al crear pedido', error: error.message });
    }
  },

  async updateOrder(req, res) {
    try {
      // Note: Updating order items (order_dishes) is more complex
      // This basic update only covers the total if needed
      const { total } = req.body;
      const updatedOrder = await orderModel.update(req.params.id, total);
      if (updatedOrder == null) {
        return res.status(404).json({ message: 'Pedido no encontrado' });
      }
      res.status(200).json({ message: 'Pedido actualizado exitosamente', data: updatedOrder });
    } catch (error) {
      res.status(400).json({ message: 'Error al actualizar pedido', error: error.message });
    }
  },

  async deleteOrder(req, res) {
    try {
      const deletedOrder = await orderModel.delete(req.params.id);
      if (deletedOrder == null) {
        return res.status(404).json({ message: 'Pedido no encontrado' });
      }
      res.status(200).json({ message: 'Pedido eliminado exitosamente', data: deletedOrder });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar pedido', error: error.message });
    }
  },

  async findOrders(req, res) {
    try {
      const filterOptions = req.query; // Obtener opciones de filtro de los query parameters
      const foundOrders = await orderModel.find(filterOptions);
      res.status(200).json({ message: 'Pedidos encontrados exitosamente', data: foundOrders });
    } catch (error) {
      res.status(500).json({ message: 'Error al buscar pedidos', error: error.message });
    }
  },
};

module.exports = orderController; 