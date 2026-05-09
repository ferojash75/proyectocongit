const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

// Productos
router.get('/productos', productoController.listar);
router.post('/productos', productoController.crear);

// Búsqueda por código de barra
router.get('/productos/barcode/:codigo', productoController.buscarPorBarcode);

module.exports = router;
