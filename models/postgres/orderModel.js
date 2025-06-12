const pool = require('../../config/postgres');

const orderModel = {
  async create(customer_id, dishes) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Crear la orden
      const orderResult = await client.query(
        'INSERT INTO orders (customer_id) VALUES ($1) RETURNING *',
        [customer_id]
      );
      const order = orderResult.rows[0];

      // Insertar los detalles de la orden
      for (const dish of dishes) {
        await client.query(
          'INSERT INTO order_dishes (order_id, dish_id, quantity) VALUES ($1, $2, $3)',
          [order.id, dish.dish_id, dish.quantity]
        );
      }

      await client.query('COMMIT');

      // Retornar la orden completa con sus detalles
      return this.getById(order.id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  async getAll() {
    const result = await pool.query(`
      SELECT 
        o.id,
        o.customer_id,
        o.order_date,
        SUM(d.price * od.quantity) as total,
        c.name as customer_name,
        json_agg(
          json_build_object(
            'dish_id', od.dish_id,
            'dish_name', d.name,
            'quantity', od.quantity,
            'price', d.price
          )
        ) as order_details
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN order_dishes od ON o.id = od.order_id
      LEFT JOIN dishes d ON od.dish_id = d.id
      GROUP BY o.id, o.customer_id, o.order_date, c.name
      ORDER BY o.order_date DESC
    `);
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(`
      SELECT 
        o.id,
        o.customer_id,
        o.order_date,
        SUM(d.price * od.quantity) as total,
        c.name as customer_name,
        json_agg(
          json_build_object(
            'dish_id', od.dish_id,
            'dish_name', d.name,
            'quantity', od.quantity,
            'price', d.price
          )
        ) as order_details
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN order_dishes od ON o.id = od.order_id
      LEFT JOIN dishes d ON od.dish_id = d.id
      WHERE o.id = $1
      GROUP BY o.id, o.customer_id, o.order_date, c.name
    `, [id]);
    return result.rows[0];
  },

  async find(filterOptions) {
    let query = 'SELECT * FROM orders WHERE 1=1';
    const values = [];
    let paramIndex = 1;

    if (filterOptions.customer_id) {
      query += ` AND customer_id = $${paramIndex}`;
      values.push(filterOptions.customer_id);
      paramIndex++;
    }

    if (filterOptions.date) {
      // Assuming date is passed as YYYY-MM-DD and order_date is a DATE or TIMESTAMP
      query += ` AND order_date::date = $${paramIndex}`;
      values.push(filterOptions.date);
      paramIndex++;
    }

    const { rows } = await pool.query(query, values);
    return rows;
  },

  async update(id, total) {
    const result = await pool.query(
      'UPDATE orders SET total = $1 WHERE id = $2 RETURNING *',
      [total, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Eliminar los detalles de la orden
      await client.query('DELETE FROM order_dishes WHERE order_id = $1', [id]);

      // Eliminar la orden
      const result = await client.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  async filter(filterOptions) {
    let query = `
      SELECT 
        o.id,
        o.customer_id,
        o.order_date,
        SUM(d.price * od.quantity) as total,
        c.name as customer_name,
        json_agg(
          json_build_object(
            'dish_id', od.dish_id,
            'dish_name', d.name,
            'quantity', od.quantity,
            'price', d.price
          )
        ) as order_details
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN order_dishes od ON o.id = od.order_id
      LEFT JOIN dishes d ON od.dish_id = d.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (filterOptions.customer_id) {
      query += ` AND o.customer_id = $${paramCount}`;
      params.push(filterOptions.customer_id);
      paramCount++;
    }

    if (filterOptions.date) {
      query += ` AND DATE(o.order_date) = $${paramCount}`;
      params.push(filterOptions.date);
      paramCount++;
    }

    query += ` GROUP BY o.id, o.customer_id, o.order_date, c.name
               ORDER BY o.order_date DESC`;

    const result = await pool.query(query, params);
    return result.rows;
  },
};

module.exports = orderModel; 