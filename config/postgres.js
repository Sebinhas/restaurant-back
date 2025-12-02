const { Pool } = require('pg');

// Validar que todas las variables de entorno estén definidas
const requiredEnvVars = ['PG_USER', 'PG_HOST', 'PG_DATABASE', 'PG_PASSWORD', 'PG_PORT'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Error: Faltan las siguientes variables de entorno:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nPor favor, verifica tu archivo .env');
}

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT) || 5432,
});

// Probar la conexión al iniciar
pool.connect()
  .then(client => {
    console.log('✅ Conexión a PostgreSQL establecida correctamente');
    console.log(`   Base de datos: ${process.env.PG_DATABASE}`);
    console.log(`   Host: ${process.env.PG_HOST}:${process.env.PG_PORT}`);
    client.release();
  })
  .catch(err => {
    console.error('❌ Error al conectar con PostgreSQL:');
    console.error(`   ${err.message}`);
    console.error('\n💡 Verifica:');
    console.error('   1. Que PostgreSQL esté corriendo');
    console.error('   2. Que las credenciales en .env sean correctas');
    console.error('   3. Que la base de datos "restaurant" exista');
  });

module.exports = pool;