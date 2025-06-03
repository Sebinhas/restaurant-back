const pool = require('../../config/postgres');

const dishModel = {
  async create(name, category, price, available) {
    const query = 'INSERT INTO dishes (name, category, price, available) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [name, category, price, available];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async getAll() {
    const query = 'SELECT * FROM dishes';
    const { rows } = await pool.query(query);
    return rows;
  },

  async getById(id) {
    const query = 'SELECT * FROM dishes WHERE id = $1';
    const values = [id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async update(id, name, category, price, available) {
    const query = 'UPDATE dishes SET name = $1, category = $2, price = $3, available = $4 WHERE id = $5 RETURNING *';
    const values = [name, category, price, available, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async delete(id) {
    const query = 'DELETE FROM dishes WHERE id = $1 RETURNING *';
    const values = [id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async find(filterOptions) {
    let query = 'SELECT * FROM dishes WHERE 1=1';
    const values = [];
    let paramIndex = 1;

    if (filterOptions.name) {
      query += ` AND name ILIKE $${paramIndex}`;
      values.push(`%${filterOptions.name}%`);
      paramIndex++;
    }

    if (filterOptions.category) {
      query += ` AND category ILIKE $${paramIndex}`;
      values.push(`%${filterOptions.category}%`);
      paramIndex++;
    }

    if (filterOptions.available !== undefined) {
      query += ` AND available = $${paramIndex}`;
      values.push(filterOptions.available);
      paramIndex++;
    }

    const { rows } = await pool.query(query, values);
    return rows;
  },
};

module.exports = dishModel; 