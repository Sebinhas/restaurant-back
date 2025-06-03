const dishModel = require('../models/postgres/dishModel');

const dishController = {
  async getAllDishes(req, res) {
    try {
      const dishes = await dishModel.getAll();
      res.status(200).json({ message: 'Platos obtenidos exitosamente', data: dishes });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener platos', error: error.message });
    }
  },

  async getDishById(req, res) {
    try {
      const dish = await dishModel.getById(req.params.id);
      if (dish == null) {
        return res.status(404).json({ message: 'Plato no encontrado' });
      }
      res.status(200).json({ message: 'Plato obtenido exitosamente', data: dish });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener plato', error: error.message });
    }
  },

  async createDish(req, res) {
    try {
      const { name, category, price, available } = req.body;
      const newDish = await dishModel.create(name, category, price, available);
      res.status(201).json({ message: 'Plato creado exitosamente', data: newDish });
    } catch (error) {
      res.status(400).json({ message: 'Error al crear plato', error: error.message });
    }
  },

  async updateDish(req, res) {
    try {
      const { name, category, price, available } = req.body;
      const updatedDish = await dishModel.update(req.params.id, name, category, price, available);
      if (updatedDish == null) {
        return res.status(404).json({ message: 'Plato no encontrado' });
      }
      res.status(200).json({ message: 'Plato actualizado exitosamente', data: updatedDish });
    } catch (error) {
      res.status(400).json({ message: 'Error al actualizar plato', error: error.message });
    }
  },

  async deleteDish(req, res) {
    try {
      const deletedDish = await dishModel.delete(req.params.id);
      if (deletedDish == null) {
        return res.status(404).json({ message: 'Plato no encontrado' });
      }
      res.status(200).json({ message: 'Plato eliminado exitosamente', data: deletedDish });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar plato', error: error.message });
    }
  },

  async findDishes(req, res) {
    try {
      const filterOptions = req.query; // Obtener opciones de filtro de los query parameters
      const foundDishes = await dishModel.find(filterOptions);
      res.status(200).json({ message: 'Platos encontrados exitosamente', data: foundDishes });
    } catch (error) {
      res.status(500).json({ message: 'Error al buscar platos', error: error.message });
    }
  },
};

module.exports = dishController; 