const tableModel = require('../models/postgres/tableModel');

const tableController = {
  async getAllTables(req, res) {
    try {
      const tables = await tableModel.getAll();
      res.status(200).json({ message: 'Mesas obtenidas exitosamente', data: tables });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener mesas', error: error.message });
    }
  },

  async getTableById(req, res) {
    try {
      const table = await tableModel.getById(req.params.id);
      if (table == null) {
        return res.status(404).json({ message: 'Mesa no encontrada' });
      }
      res.status(200).json({ message: 'Mesa obtenida exitosamente', data: table });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener mesa', error: error.message });
    }
  },

  async createTable(req, res) {
    try {
      const { capacity, location } = req.body;
      const newTable = await tableModel.create(capacity, location);
      res.status(201).json({ message: 'Mesa creada exitosamente', data: newTable });
    } catch (error) {
      res.status(400).json({ message: 'Error al crear mesa', error: error.message });
    }
  },

  async updateTable(req, res) {
    try {
      const { capacity, location } = req.body;
      const updatedTable = await tableModel.update(req.params.id, capacity, location);
      if (updatedTable == null) {
        return res.status(404).json({ message: 'Mesa no encontrada' });
      }
      res.status(200).json({ message: 'Mesa actualizada exitosamente', data: updatedTable });
    } catch (error) {
      res.status(400).json({ message: 'Error al actualizar mesa', error: error.message });
    }
  },

  async deleteTable(req, res) {
    try {
      const deletedTable = await tableModel.delete(req.params.id);
      if (deletedTable == null) {
        return res.status(404).json({ message: 'Mesa no encontrada' });
      }
      res.status(200).json({ message: 'Mesa eliminada exitosamente', data: deletedTable });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar mesa', error: error.message });
    }
  },
};

module.exports = tableController; 