require('dotenv').config();
const express = require('express');
const path = require('path');

const apiRoutes = require('./routes/api');
const viewRoutes = require('./routes/views');

const app = express();

// Motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api', apiRoutes);
app.use('/', viewRoutes);

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).render('error', { mensaje: 'Página no encontrada', codigo: 404 });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { mensaje: 'Error interno del servidor', codigo: 500 });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
