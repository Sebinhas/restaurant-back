const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

require('./config/mongo');
require('./config/postgres');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/tables', require('./routes/tableRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));
app.use('/api/dishes', require('./routes/dishRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
// app.use('/api/resenas', require('./routes/resenaRoutes'));
// app.use('/api/preferencias', require('./routes/preferenciaRoutes'));
// app.use('/api/historial', require('./routes/historialRoutes'));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});



