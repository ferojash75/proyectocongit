const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

// Inicio
router.get('/', (req, res) => {
  res.render('index', { titulo: 'Inicio' });
});

// Scanner de códigos de barra
router.get('/scanner', productoController.vistaScanner);

// Inventario
router.get('/inventario', productoController.vistaInventario);

module.exports = router;
