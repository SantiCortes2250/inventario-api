const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./models'); // Sequelize ORM
const errorHandler = require('./middlewares/errorHandler');
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares base
app.use(cors());
app.use(express.json());
app.use(errorHandler);

// Rutas
app.use('/api/auth', require('./routes/auth')); // rutas de autenticación
app.use('/api/productos', require('./routes/productos')); // rutas de productos
app.use('/api/compras', require('./routes/compras')); // rutas de compras
// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API Inventario funcionando correctamente' });
});

// Iniciar servidor + DB
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('📌 Conexión a PostgreSQL establecida con éxito.');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
  }
}

startServer();
