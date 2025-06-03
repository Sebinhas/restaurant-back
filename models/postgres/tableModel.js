const pool = require('../../config/postgres');

const tableModel = {
  async create(capacity, location) {
    const query = 'INSERT INTO tables (capacity, location) VALUES ($1, $2) RETURNING *';
    const values = [capacity, location];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async getAll() {
    const query = 'SELECT * FROM tables';
    const { rows } = await pool.query(query);
    return rows;
  },

  async getById(id) {
    const query = 'SELECT * FROM tables WHERE id = $1';
    const values = [id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async update(id, capacity, location) {
    const query = 'UPDATE tables SET capacity = $1, location = $2 WHERE id = $3 RETURNING *';
    const values = [capacity, location, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async delete(id) {
    const query = 'DELETE FROM tables WHERE id = $1 RETURNING *';
    const values = [id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },
};

module.exports = tableModel; 