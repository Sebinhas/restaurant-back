-- ============================================
-- Script para recrear la base de datos completa
-- ============================================
-- Este script elimina todas las tablas existentes y las recrea desde cero
-- Úsalo cuando necesites recrear la base de datos

-- Eliminar tablas en orden inverso (respetando las foreign keys)
DROP TABLE IF EXISTS order_dishes CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS dishes CASCADE;
DROP TABLE IF EXISTS tables CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

-- Crear tabla de clientes
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20)
);

-- Crear tabla de mesas
CREATE TABLE tables (
    id SERIAL PRIMARY KEY,
    capacity INTEGER NOT NULL,
    location VARCHAR(100)
);

-- Crear tabla de platos
CREATE TABLE dishes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    price DECIMAL(10,2) NOT NULL,
    available BOOLEAN DEFAULT true
);

-- Crear tabla de reservaciones
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    table_id INTEGER REFERENCES tables(id),
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de órdenes
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) DEFAULT 0.00
);

-- Crear tabla de detalles de orden (order_dishes)
CREATE TABLE order_dishes (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    dish_id INTEGER REFERENCES dishes(id),
    quantity INTEGER NOT NULL
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_dishes_category ON dishes(category);
CREATE INDEX idx_reservations_date ON reservations(reservation_date);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_order_dishes_order ON order_dishes(order_id);
CREATE INDEX idx_order_dishes_dish ON order_dishes(dish_id);

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'Base de datos recreada exitosamente!';
END $$;


