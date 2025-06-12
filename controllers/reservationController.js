const reservationModel = require('../models/postgres/reservationModel');

const reservationController = {
  async getAllReservations(req, res) {
    try {
      const reservations = await reservationModel.getAll();
      res.status(200).json({ message: 'Reservas obtenidas exitosamente', data: reservations });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener reservas', error: error.message });
    }
  },

  async getReservationById(req, res) {
    try {
      const reservation = await reservationModel.getById(req.params.id);
      if (reservation == null) {
        return res.status(404).json({ message: 'Reserva no encontrada' });
      }
      res.status(200).json({ message: 'Reserva obtenida exitosamente', data: reservation });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener reserva', error: error.message });
    }
  },

  async createReservation(req, res) {
    try {
      const { customer_id, table_id, reservation_date, reservation_time } = req.body;

      // Validar si la mesa ya está reservada para esa fecha y hora
      const existingReservation = await reservationModel.findByDateTimeAndTable(
        table_id,
        reservation_date,
        reservation_time
      );

      if (existingReservation) {
        return res.status(400).json({
          message: 'La mesa ya está reservada para esta fecha y hora',
          data: existingReservation
        });
      }

      const newReservation = await reservationModel.create(
        customer_id,
        table_id,
        reservation_date,
        reservation_time
      );
      res.status(201).json({ message: 'Reserva creada exitosamente', data: newReservation });
    } catch (error) {
      res.status(400).json({ message: 'Error al crear reserva', error: error.message });
    }
  },

  async updateReservation(req, res) {
    try {
      const { customer_id, table_id, reservation_date, reservation_time } = req.body;

      // Validar si la mesa ya está reservada para esa fecha y hora (excluyendo la reserva actual)
      const existingReservation = await reservationModel.findByDateTimeAndTable(
        table_id,
        reservation_date,
        reservation_time,
        req.params.id // Excluir la reserva actual
      );

      if (existingReservation) {
        return res.status(400).json({
          message: 'La mesa ya está reservada para esta fecha y hora',
          data: existingReservation
        });
      }

      const updatedReservation = await reservationModel.update(
        req.params.id,
        customer_id,
        table_id,
        reservation_date,
        reservation_time
      );
      if (updatedReservation == null) {
        return res.status(404).json({ message: 'Reserva no encontrada' });
      }
      res.status(200).json({ message: 'Reserva actualizada exitosamente', data: updatedReservation });
    } catch (error) {
      res.status(400).json({ message: 'Error al actualizar reserva', error: error.message });
    }
  },

  async deleteReservation(req, res) {
    try {
      const deletedReservation = await reservationModel.delete(req.params.id);
      if (deletedReservation == null) {
        return res.status(404).json({ message: 'Reserva no encontrada' });
      }
      res.status(200).json({ message: 'Reserva eliminada exitosamente', data: deletedReservation });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar reserva', error: error.message });
    }
  },

  async filterReservations(req, res) {
    try {
      const filterOptions = req.query;
      const filteredReservations = await reservationModel.filter(filterOptions);
      res.status(200).json({ message: 'Reservas filtradas exitosamente', data: filteredReservations });
    } catch (error) {
      res.status(500).json({ message: 'Error al filtrar reservas', error: error.message });
    }
  },
};

module.exports = reservationController; 