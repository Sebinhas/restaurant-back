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
    number INTEGER NOT NULL UNIQUE,
    capacity INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'available'
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

-- Crear tabla de detalles de orden
CREATE TABLE order_details (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    dish_id INTEGER REFERENCES dishes(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_tables_number ON tables(number);
CREATE INDEX idx_dishes_category ON dishes(category);
CREATE INDEX idx_reservations_date ON reservations(reservation_date);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_order_details_order ON order_details(order_id);
CREATE INDEX idx_order_details_dish ON order_details(dish_id);

-- Insertar datos de prueba

-- Insertar clientes
INSERT INTO customers (name, email, phone) VALUES
('Juan Pérez', 'juan.perez@email.com', '3001234567'),
('María García', 'maria.garcia@email.com', '3002345678'),
('Carlos Rodríguez', 'carlos.rodriguez@email.com', '3003456789'),
('Ana Martínez', 'ana.martinez@email.com', '3004567890'),
('Luis Fernández', 'luis.fernandez@email.com', '3005678901');

-- Insertar mesas
INSERT INTO tables (number, capacity, status) VALUES
(1, 2, 'available'),
(2, 4, 'available'),
(3, 4, 'occupied'),
(4, 6, 'available'),
(5, 2, 'available'),
(6, 8, 'available'),
(7, 4, 'reserved'),
(8, 2, 'available');

-- Insertar platos
INSERT INTO dishes (name, category, price, available) VALUES
('Hamburguesa Clásica', 'Plato Principal', 15000.00, true),
('Pizza Margarita', 'Plato Principal', 20000.00, true),
('Ensalada César', 'Entrada', 12000.00, true),
('Sopa del Día', 'Entrada', 8000.00, true),
('Pasta Carbonara', 'Plato Principal', 18000.00, true),
('Pescado a la Plancha', 'Plato Principal', 25000.00, true),
('Tiramisú', 'Postre', 8000.00, true),
('Helado de Vainilla', 'Postre', 6000.00, true),
('Agua', 'Bebida', 3000.00, true),
('Refresco', 'Bebida', 5000.00, true),
('Cerveza', 'Bebida', 7000.00, true),
('Vino Tinto', 'Bebida', 15000.00, true);

-- Insertar reservaciones
INSERT INTO reservations (customer_id, table_id, reservation_date, reservation_time, status) VALUES
(1, 1, '2024-12-20', '19:00:00', 'confirmed'),
(2, 4, '2024-12-20', '20:00:00', 'pending'),
(3, 2, '2024-12-21', '19:30:00', 'confirmed'),
(4, 6, '2024-12-21', '20:30:00', 'pending'),
(5, 3, '2024-12-22', '19:00:00', 'confirmed');

-- Insertar órdenes
INSERT INTO orders (customer_id, order_date, total) VALUES
(1, '2024-12-19 19:15:00', 35000.00),
(2, '2024-12-19 20:30:00', 28000.00),
(3, '2024-12-19 21:00:00', 45000.00),
(1, '2024-12-20 12:30:00', 20000.00),
(4, '2024-12-20 13:45:00', 31000.00);

-- Insertar detalles de orden
INSERT INTO order_details (order_id, dish_id, quantity, price) VALUES
-- Orden 1 (Juan Pérez)
(1, 1, 2, 15000.00),  -- 2 Hamburguesas
(1, 9, 2, 3000.00),   -- 2 Aguas
(1, 7, 1, 8000.00),   -- 1 Tiramisú
-- Orden 2 (María García)
(2, 3, 1, 12000.00),  -- 1 Ensalada César
(2, 5, 1, 18000.00),  -- 1 Pasta Carbonara
(2, 10, 1, 5000.00),  -- 1 Refresco
-- Orden 3 (Carlos Rodríguez)
(3, 2, 1, 20000.00),  -- 1 Pizza Margarita
(3, 6, 1, 25000.00),  -- 1 Pescado a la Plancha
(3, 12, 1, 15000.00), -- 1 Vino Tinto
-- Orden 4 (Juan Pérez - segunda orden)
(4, 2, 1, 20000.00),  -- 1 Pizza Margarita
-- Orden 5 (Ana Martínez)
(5, 4, 1, 8000.00),   -- 1 Sopa del Día
(5, 1, 1, 15000.00),  -- 1 Hamburguesa
(5, 8, 1, 6000.00),   -- 1 Helado
(5, 11, 1, 7000.00);  -- 1 Cerveza 