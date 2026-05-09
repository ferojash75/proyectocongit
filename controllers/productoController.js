const Producto = require('../models/Producto');

const productoController = {
  /**
   * API: Busca un producto por código de barra.
   * GET /api/productos/barcode/:codigo
   */
  async buscarPorBarcode(req, res) {
    try {
      const { codigo } = req.params;

      if (!codigo || codigo.trim() === '') {
        return res.status(400).json({ error: 'Código de barra requerido' });
      }

      const producto = await Producto.findByBarcode(codigo.trim());

      if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado', codigo });
      }

      return res.json({ producto });
    } catch (error) {
      console.error('Error al buscar por barcode:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  /**
   * API: Lista todos los productos.
   * GET /api/productos
   */
  async listar(req, res) {
    try {
      const productos = await Producto.findAll();
      return res.json({ productos });
    } catch (error) {
      console.error('Error al listar productos:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  /**
   * API: Crea un nuevo producto.
   * POST /api/productos
   */
  async crear(req, res) {
    try {
      const { nombre, descripcion, precio, stock, codigo_barra, categoria } = req.body;

      if (!nombre || !precio) {
        return res.status(400).json({ error: 'Nombre y precio son requeridos' });
      }

      const id = await Producto.create({ nombre, descripcion, precio, stock, codigo_barra, categoria });
      const producto = await Producto.findById(id);

      return res.status(201).json({ mensaje: 'Producto creado', producto });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'El código de barra ya está registrado' });
      }
      console.error('Error al crear producto:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  /**
   * Vista: Página del scanner de códigos de barra.
   * GET /scanner
   */
  async vistaScanner(req, res) {
    try {
      const productos = await Producto.findAll();
      return res.render('scanner', { titulo: 'Scanner de Códigos de Barra', productos });
    } catch (error) {
      console.error('Error al cargar vista scanner:', error);
      return res.status(500).render('error', { mensaje: 'Error al cargar el scanner', codigo: 500 });
    }
  },

  /**
   * Vista: Página de inventario.
   * GET /inventario
   */
  async vistaInventario(req, res) {
    try {
      const productos = await Producto.findAll();
      return res.render('inventario', { titulo: 'Inventario', productos });
    } catch (error) {
      console.error('Error al cargar inventario:', error);
      return res.status(500).render('error', { mensaje: 'Error al cargar inventario', codigo: 500 });
    }
  },
};

module.exports = productoController;
