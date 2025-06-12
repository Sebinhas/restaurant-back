const pool = require('../../config/postgres');

const reservationModel = {
  async getAll() {
    const result = await pool.query('SELECT * FROM reservations');
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query('SELECT * FROM reservations WHERE id = $1', [id]);
    return result.rows[0];
  },

  async findByDateTimeAndTable(table_id, date, time, excludeReservationId = null) {
    let query = `
      SELECT * FROM reservations 
      WHERE table_id = $1 
      AND reservation_date = $2 
      AND reservation_time = $3
    `;
    const params = [table_id, date, time];

    if (excludeReservationId) {
      query += ' AND id != $4';
      params.push(excludeReservationId);
    }

    const result = await pool.query(query, params);
    return result.rows[0];
  },

  async create(customer_id, table_id, reservation_date, reservation_time) {
    const result = await pool.query(
      'INSERT INTO reservations (customer_id, table_id, reservation_date, reservation_time) VALUES ($1, $2, $3, $4) RETURNING *',
      [customer_id, table_id, reservation_date, reservation_time]
    );
    return result.rows[0];
  },

  async update(id, customer_id, table_id, reservation_date, reservation_time) {
    const result = await pool.query(
      'UPDATE reservations SET customer_id = $1, table_id = $2, reservation_date = $3, reservation_time = $4 WHERE id = $5 RETURNING *',
      [customer_id, table_id, reservation_date, reservation_time, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query('DELETE FROM reservations WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },

  async filter(filterOptions) {
    let query = 'SELECT * FROM reservations WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (filterOptions.customer_id) {
      query += ` AND customer_id = $${paramCount}`;
      params.push(filterOptions.customer_id);
      paramCount++;
    }

    if (filterOptions.table_id) {
      query += ` AND table_id = $${paramCount}`;
      params.push(filterOptions.table_id);
      paramCount++;
    }

    if (filterOptions.reservation_date) {
      query += ` AND reservation_date = $${paramCount}`;
      params.push(filterOptions.reservation_date);
      paramCount++;
    }

    if (filterOptions.reservation_time) {
      query += ` AND reservation_time = $${paramCount}`;
      params.push(filterOptions.reservation_time);
      paramCount++;
    }

    const result = await pool.query(query, params);
    return result.rows;
  },
};

module.exports = reservationModel; 