const pool = require('../../config/postgres');

const orderModel = {
  async create(customer_id, dishes) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Calculate total (assuming dish prices are needed from dishes table)
      let total = 0;
      // A more robust implementation would fetch dish prices from the 'dishes' table
      // For simplicity, let's assume dish objects in the input 'dishes' array have a 'price' property
      if (dishes && dishes.length > 0) {
        // In a real app, fetch dish prices from DB using dish_id
        // const dishIds = dishes.map(d => d.dish_id);
        // const dishPrices = await client.query('SELECT id, price FROM dishes WHERE id = ANY($1)', [dishIds]);
        // const priceMap = new Map(dishPrices.rows.map(item => [item.id, item.price]));
        // total = dishes.reduce((sum, item) => sum + (priceMap.get(item.dish_id) || 0) * item.quantity, 0);
        // For now, using price from input (less safe/accurate)
         total = dishes.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
      }

      // Insert into orders table
      const orderQuery = 'INSERT INTO orders (customer_id, order_date, total) VALUES ($1, NOW(), $2) RETURNING id';
      const orderValues = [customer_id, total];
      const orderResult = await client.query(orderQuery, orderValues);
      const orderId = orderResult.rows[0].id;

      // Insert into order_dishes table
      if (dishes && dishes.length > 0) {
        const orderDishesQuery = 'INSERT INTO order_dishes (order_id, dish_id, quantity) VALUES ($1, $2, $3)';
        for (const dishItem of dishes) {
          await client.query(orderDishesQuery, [orderId, dishItem.dish_id, dishItem.quantity]);
        }
      }

      await client.query('COMMIT');
      return { id: orderId, customer_id, order_date: new Date(), total, dishes };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  async getAll() {
    // This query might need adjustment based on how much detail is needed for a list view
    const query = 'SELECT * FROM orders';
    const { rows } = await pool.query(query);
    return rows;
  },

  async getById(id) {
    const query = 'SELECT o.*, json_agg(od.*) as order_items FROM orders o JOIN order_dishes od ON o.id = od.order_id WHERE o.id = $1 GROUP BY o.id';
    const values = [id];
    const { rows } = await pool.query(query, values);
    return rows[0];
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

  // Basic update and delete - might need refinement depending on requirements
  async update(id, total) {
      const query = 'UPDATE orders SET total = $1 WHERE id = $2 RETURNING *';
      const values = [total, id];
      const { rows } = await pool.query(query, values);
      return rows[0];
  },

  async delete(id) {
      const client = await pool.connect();
      try {
          await client.query('BEGIN');
          // Delete dependent rows in order_dishes first
          await client.query('DELETE FROM order_dishes WHERE order_id = $1', [id]);
          // Then delete the order
          const query = 'DELETE FROM orders WHERE id = $1 RETURNING *';
          const values = [id];
          const { rows } = await client.query(query, values);
          await client.query('COMMIT');
          return rows[0];
      } catch (error) {
          await client.query('ROLLBACK');
          throw error;
      } finally {
          client.release();
      }
  },
};

module.exports = orderModel; 