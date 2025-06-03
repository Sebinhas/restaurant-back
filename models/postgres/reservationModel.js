const pool = require('../../config/postgres');

const reservationModel = {
  async create(customer_id, table_id, reservation_date, reservation_time) {
    const query = 'INSERT INTO reservations (customer_id, table_id, reservation_date, reservation_time) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [customer_id, table_id, reservation_date, reservation_time];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async getAll() {
    const query = 'SELECT * FROM reservations';
    const { rows } = await pool.query(query);
    return rows;
  },

  async getById(id) {
    const query = 'SELECT * FROM reservations WHERE id = $1';
    const values = [id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async update(id, customer_id, table_id, reservation_date, reservation_time) {
    const query = 'UPDATE reservations SET customer_id = $1, table_id = $2, reservation_date = $3, reservation_time = $4 WHERE id = $5 RETURNING *';
    const values = [customer_id, table_id, reservation_date, reservation_time, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async delete(id) {
    const query = 'DELETE FROM reservations WHERE id = $1 RETURNING *';
    const values = [id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async filter(filterOptions) {
    let query = 'SELECT * FROM reservations WHERE 1=1';
    const values = [];
    let paramIndex = 1;

    if (filterOptions.date) {
      query += ` AND reservation_date = $${paramIndex}`;
      values.push(filterOptions.date);
      paramIndex++;
    }

    if (filterOptions.customer_id) {
      query += ` AND customer_id = $${paramIndex}`;
      values.push(filterOptions.customer_id);
      paramIndex++;
    }

    const { rows } = await pool.query(query, values);
    return rows;
  },
};

module.exports = reservationModel; 