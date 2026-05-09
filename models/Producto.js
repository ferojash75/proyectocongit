const db = require('../config/db');

class Producto {
  /**
   * Busca un producto por su código de barra.
   * @param {string} codigo - El código de barra escaneado.
   * @returns {Promise<Object|null>} El producto encontrado o null.
   */
  static async findByBarcode(codigo) {
    const [rows] = await db.execute(
      'SELECT * FROM productos WHERE codigo_barra = ? AND activo = 1 LIMIT 1',
      [codigo]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Obtiene todos los productos activos.
   * @returns {Promise<Array>} Lista de productos.
   */
  static async findAll() {
    const [rows] = await db.execute(
      'SELECT * FROM productos WHERE activo = 1 ORDER BY nombre ASC'
    );
    return rows;
  }

  /**
   * Busca un producto por su ID.
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM productos WHERE id = ? AND activo = 1 LIMIT 1',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Crea un nuevo producto.
   * @param {Object} datos
   * @returns {Promise<number>} ID del producto creado.
   */
  static async create(datos) {
    const { nombre, descripcion, precio, stock, codigo_barra, categoria } = datos;
    const [result] = await db.execute(
      `INSERT INTO productos (nombre, descripcion, precio, stock, codigo_barra, categoria)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion || null, precio, stock || 0, codigo_barra || null, categoria || null]
    );
    return result.insertId;
  }

  /**
   * Actualiza stock de un producto.
   * @param {number} id
   * @param {number} cantidad - Cantidad a descontar (negativa para descontar).
   * @returns {Promise<boolean>}
   */
  static async actualizarStock(id, cantidad) {
    const [result] = await db.execute(
      'UPDATE productos SET stock = stock + ? WHERE id = ? AND activo = 1',
      [cantidad, id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Producto;
