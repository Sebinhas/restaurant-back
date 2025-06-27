const pool = require('../../config/postgres');

const customerModel = {
  async create(name, email, phone) {
    const query = 'INSERT INTO customers (name, email, phone) VALUES ($1, $2, $3) RETURNING *';
    const values = [name, email, phone];
    const { rows } = await pool.query(query, valuse);
    return rows[0];
  },

  async getAll() {
    const query = 'SELECT * FROM customers';
    const { rows } = await pool.query(query);
    return rows;
  },

  async getById(id) {
    const query = 'SELECT * FROM customers WHERE id = $1';
    const values = [id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async update(id, name, email, phone) {
    const query = 'UPDATE customers SET name = $1, email = $2, phone = $3 WHERE id = $4 RETURNING *';
    const values = [name, email, phone, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async delete(id) {
    const query = 'DELETE FROM customers WHERE id = $1 RETURNING *';
    const values = [id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },
};

module.exports = customerModel;