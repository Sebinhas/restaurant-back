const customerModel = require('../models/postgres/customerModel');

const customerController = {
  async getAllCustomers(req, res) {
    try {
      const customers = await customerModel.getAll();
      res.status(200).json({ message: 'Clientes obtenidos exitosamente', data: customers });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener clientes', error: error.message });
    }
  },

  async getCustomerById(req, res) {
    try {
      const customer = await customerModel.getById(req.params.id);
      if (customer == null) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }
      res.status(200).json({ message: 'Cliente obtenido exitosamente', data: customer });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener cliente', error: error.message });
    }
  },

  async createCustomer(req, res) {
    try {
      const { name, email, phone } = req.body;
      const newCustomer = await customerModel.create(name, email, phone);
      res.status(201).json({ message: 'Cliente creado exitosamente', data: newCustomer });
    } catch (error) {
      res.status(400).json({ message: 'Error al crear cliente', error: error.message });
    }
  },

  async updateCustomer(req, res) {
    try {
      const { name, email, phone } = req.body;
      const updatedCustomer = await customerModel.update(req.params.id, name, email, phone);
      if (updatedCustomer == null) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }
      res.status(200).json({ message: 'Cliente actualizado exitosamente', data: updatedCustomer });
    } catch (error) {
      res.status(400).json({ message: 'Error al actualizar cliente', error: error.message });
    }
  },

  async deleteCustomer(req, res) {
    try {
      const deletedCustomer = await customerModel.delete(req.params.id);
      if (deletedCustomer == null) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }
      res.status(200).json({ message: 'Cliente eliminado exitosamente', data: deletedCustomer });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar cliente', error: error.message });
    }
  },
};

module.exports = customerController; 