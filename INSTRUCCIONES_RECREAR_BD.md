# Instrucciones para Recrear la Base de Datos

Este documento explica cómo recrear la base de datos desde cero usando DBeaver o pgAdmin.

## Opción 1: Usando DBeaver

### Pasos:

1. **Abrir DBeaver y conectarte a tu base de datos PostgreSQL**
   - Haz clic derecho en tu conexión PostgreSQL
   - Selecciona "SQL Editor" → "New SQL Script"

2. **Abrir el script SQL**
   - Ve a: `File` → `Open SQL Script`
   - Navega a: `migrations/recreate_database.sql`
   - O simplemente copia y pega el contenido del archivo

3. **Ejecutar el script**
   - Asegúrate de estar conectado a la base de datos correcta (verifica en la barra superior)
   - Haz clic en el botón "Execute SQL Script" (▶️) o presiona `Ctrl+Enter`
   - El script eliminará todas las tablas existentes y las recreará

4. **Verificar**
   - Expande tu base de datos en el navegador
   - Deberías ver las siguientes tablas:
     - `customers`
     - `tables`
     - `dishes`
     - `reservations`
     - `orders`
     - `order_dishes`

## Opción 2: Usando pgAdmin

### Pasos:

1. **Abrir pgAdmin y conectarte a tu servidor PostgreSQL**
   - Expande tu servidor en el panel izquierdo
   - Expande "Databases" y selecciona tu base de datos

2. **Abrir Query Tool**
   - Haz clic derecho en tu base de datos
   - Selecciona "Query Tool" (o presiona `Alt+Shift+Q`)

3. **Abrir el script SQL**
   - Ve a: `File` → `Open File`
   - Navega a: `migrations/recreate_database.sql`
   - O copia y pega el contenido del archivo en el editor

4. **Ejecutar el script**
   - Haz clic en el botón "Execute" (▶️) o presiona `F5`
   - El script eliminará todas las tablas existentes y las recreará

5. **Verificar**
   - En el panel izquierdo, expande tu base de datos
   - Expande "Schemas" → "public" → "Tables"
   - Deberías ver todas las tablas listadas

## Estructura de las Tablas

### customers
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(100) NOT NULL)
- `email` (VARCHAR(100) UNIQUE)
- `phone` (VARCHAR(20))

### tables
- `id` (SERIAL PRIMARY KEY)
- `capacity` (INTEGER NOT NULL)
- `location` (VARCHAR(100))

### dishes
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(100) NOT NULL)
- `category` (VARCHAR(50))
- `price` (DECIMAL(10,2) NOT NULL)
- `available` (BOOLEAN DEFAULT true)

### reservations
- `id` (SERIAL PRIMARY KEY)
- `customer_id` (INTEGER REFERENCES customers(id))
- `table_id` (INTEGER REFERENCES tables(id))
- `reservation_date` (DATE NOT NULL)
- `reservation_time` (TIME NOT NULL)
- `status` (VARCHAR(20) DEFAULT 'pending')
- `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

### orders
- `id` (SERIAL PRIMARY KEY)
- `customer_id` (INTEGER REFERENCES customers(id))
- `order_date` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
- `total` (DECIMAL(10,2) DEFAULT 0.00)

### order_dishes
- `id` (SERIAL PRIMARY KEY)
- `order_id` (INTEGER REFERENCES orders(id) ON DELETE CASCADE)
- `dish_id` (INTEGER REFERENCES dishes(id))
- `quantity` (INTEGER NOT NULL)

## Notas Importantes

⚠️ **ADVERTENCIA**: El script `recreate_database.sql` elimina TODAS las tablas y sus datos. Asegúrate de hacer un backup si tienes datos importantes.

✅ Si solo quieres crear las tablas sin eliminar las existentes, usa el archivo `migrations/001_initial_schema.sql` (pero puede fallar si las tablas ya existen).

## Solución de Problemas

### Error: "relation already exists"
- Usa el script `recreate_database.sql` que elimina las tablas primero
- O elimina manualmente las tablas antes de ejecutar el script

### Error: "permission denied"
- Asegúrate de estar conectado con un usuario que tenga permisos de administrador
- Verifica que estés conectado a la base de datos correcta

### Error: "database does not exist"
- Crea la base de datos primero desde DBeaver o pgAdmin
- O ejecuta: `CREATE DATABASE nombre_de_tu_base_de_datos;`

